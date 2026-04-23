import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createServiceClient } from '../../../lib/supabase';
import {
  EMAIL_BRAND,
  renderEmailContactCard,
  renderEmailHighlight,
  renderEmailLayout,
  renderEmailList,
  renderEmailMessage,
  renderEmailRows,
  renderEmailSection,
} from '../../../lib/email-templates';
import { getEmailTranslations, sanitizeLanguage } from '../../../lib/i18n/utils';
import { isEmailConfigured, sendMailTraced } from '../../../lib/mailer';

function getDefaultFromAddress(): string | undefined {
  return (
    process.env.MAIL_FROM ||
    (process.env.SMTP_USER
      ? `"${EMAIL_BRAND.companyName}" <${process.env.SMTP_USER}>`
      : undefined)
  );
}

function getOwnerAddress(): string | undefined {
  return process.env.OWNER_EMAIL || process.env.SMTP_USER;
}

export async function POST(req: Request) {
  const traceId = crypto.randomUUID();
  const requestStartMs = Date.now();
  console.info('email.req_in', { traceId, requestStartMs });

  try {
    const body = await req.json();
    const { type, language } = body;
    const selectedLanguage = sanitizeLanguage(language);

    // Handle contact form submissions
    if (type === 'contact') {
      const { name, email, phone, message, loanType } = body;

      // Validate required fields for contact form
      if (!name || !email || !message) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Get email translations
      const emailTranslations = await getEmailTranslations(selectedLanguage);

      // Validate email configuration (Resend or SMTP)
      if (!isEmailConfigured()) {
        console.error('Missing email configuration');
        return NextResponse.json(
          { error: 'Email service not configured. Please contact support.' },
          { status: 500 }
        );
      }

      const contactHtmlMessage = renderEmailLayout({
        title: emailTranslations.contactForm.title,
        subtitle: 'New contact inquiry received',
        sections: [
          renderEmailSection({
            title: 'Contact details',
            body: renderEmailRows([
              { label: emailTranslations.contactForm.fields.name, value: name },
              { label: emailTranslations.contactForm.fields.email, value: email },
              ...(phone
                ? [{ label: emailTranslations.contactForm.fields.phone, value: phone }]
                : []),
              ...(loanType
                ? [
                    {
                      label: emailTranslations.contactForm.fields.serviceInterest,
                      value: loanType,
                    },
                  ]
                : []),
            ]),
          }),
          renderEmailSection({
            title: emailTranslations.contactForm.fields.message,
            tone: 'subtle',
            body: renderEmailMessage(message),
          }),
        ],
        footerLines: [emailTranslations.contactForm.followUp],
      });

      const contactTextMessage = `
${emailTranslations.contactForm.title} - Drive Point Exchange.

${emailTranslations.contactForm.fields.name}: ${name}
${emailTranslations.contactForm.fields.email}: ${email}
${phone ? `${emailTranslations.contactForm.fields.phone}: ${phone}` : ''}
${loanType ? `${emailTranslations.contactForm.fields.serviceInterest}: ${loanType}` : ''}

${emailTranslations.contactForm.fields.message}:
${message}

${emailTranslations.contactForm.followUp}
      `;

      // Send notification to owner
      await sendMailTraced(
        { traceId, label: 'contact.owner', requestStartMs },
        {
        from: getDefaultFromAddress(),
        to: getOwnerAddress(),
        subject: `${emailTranslations.contactForm.ownerSubject.replace('{name}', name)}`,
        text: contactTextMessage,
        html: contactHtmlMessage,
        }
      );

      // Send confirmation to customer
      const customerHtmlMessage = renderEmailLayout({
        title: emailTranslations.contactForm.customerTitle,
        subtitle: EMAIL_BRAND.companyName,
        intro: [
          emailTranslations.contactForm.greeting.replace('{name}', name),
          emailTranslations.contactForm.thankYou,
        ],
        sections: [
          renderEmailSection({
            title: emailTranslations.contactForm.meanwhile,
            body: renderEmailList(emailTranslations.contactForm.meanwhileItems),
          }),
          renderEmailContactCard(
            'Need help before we reply?',
            emailTranslations.contactForm.lookForward
          ),
        ],
        footerLines: [
          emailTranslations.contactForm.bestRegards,
          emailTranslations.contactForm.teamSignature,
        ],
        ctaLabel: 'Visit Drive Point Exchange',
        ctaHref: EMAIL_BRAND.siteUrl,
      });

      await sendMailTraced(
        { traceId, label: 'contact.customer', requestStartMs },
        {
        from: getDefaultFromAddress(),
        to: email,
        subject: emailTranslations.contactForm.customerSubject,
        text: emailTranslations.contactForm.thankYou,
        html: customerHtmlMessage,
        }
      );

      // Save contact lead to Supabase
      try {
        const supabase = createServiceClient();
        const { error } = await supabase
          .from('contact_leads')
          .insert({
            name,
            email,
            phone: phone || null,
            loan_type: loanType || null,
            message,
          });

        if (error) {
          console.error('Supabase insert error:', error);
          // Don't fail the request if database insert fails
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Don't fail the request if database insert fails
      }

      return NextResponse.json({ success: true });
    }

    // Handle home loan estimate submissions
    if (type === 'home_loan_estimate') {
      const { inputs, result, isAgent: rawHomeIsAgent, smsConsent: rawHomeSmsConsent, promoCode: rawHomePromoCode } = body;
      const homeIsAgent = Boolean(rawHomeIsAgent);
      const homeSmsConsent = homeIsAgent ? false : Boolean(rawHomeSmsConsent);
      const homePromoCode = typeof rawHomePromoCode === 'string' ? rawHomePromoCode.trim() : '';

      // Validate required fields for home loan estimate
      if (!inputs || !result) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      if (homeSmsConsent && !inputs?.mobileNumber?.trim()) {
        return NextResponse.json(
          { error: 'Mobile number required for SMS consent' },
          { status: 400 }
        );
      }

      // Get email translations
      const emailTranslations = await getEmailTranslations(selectedLanguage);

      // Validate email configuration (Resend or SMTP)
      if (!isEmailConfigured()) {
        console.error('Missing email configuration');
        return NextResponse.json(
          { error: 'Email service not configured. Please contact support.' },
          { status: 500 }
        );
      }

      const {
        homePrice,
        downPayment,
        loanTerm,
        interestRate,
        propertyTax,
        homeInsurance,
        pmi,
        firstName,
        lastName,
        email,
        mobileNumber,
      } = inputs;

      const {
        monthlyPayment,
        principalInterest,
        propertyTax: monthlyPropertyTax,
        homeInsurance: monthlyHomeInsurance,
        pmi: monthlyPmi,
        totalInterest,
        loanAmount,
      } = result;

      const homeLoanHtmlMessage = renderEmailLayout({
        title: emailTranslations.homeLoanEstimate.title,
        subtitle: emailTranslations.autoLoanEstimate.company,
        intro: [
          emailTranslations.homeLoanEstimate.greeting
            .replace('{firstName}', firstName)
            .replace('{lastName}', lastName),
          emailTranslations.homeLoanEstimate.thankYou,
        ],
        sections: [
          renderEmailSection({
            title: emailTranslations.homeLoanEstimate.propertyInfo,
            body: renderEmailRows([
              {
                label: emailTranslations.homeLoanEstimate.fields.homePrice,
                value: `$${homePrice.toLocaleString()}`,
              },
              {
                label: emailTranslations.homeLoanEstimate.fields.downPayment,
                value: `-$${downPayment.toLocaleString()}`,
              },
              {
                label: emailTranslations.homeLoanEstimate.fields.loanAmount,
                value: `$${loanAmount.toLocaleString()}`,
              },
              {
                label: emailTranslations.homeLoanEstimate.fields.loanTerm,
                value: `${loanTerm} years`,
              },
              {
                label: emailTranslations.homeLoanEstimate.fields.interestRate,
                value: `${interestRate}%`,
              },
            ]),
          }),
          renderEmailHighlight({
            eyebrow: emailTranslations.homeLoanEstimate.paymentBreakdown,
            title: emailTranslations.autoLoanEstimate.fields.monthlyPayment,
            value: `$${monthlyPayment.toLocaleString()}`,
            detail: `${loanTerm} year estimate at ${interestRate}% APR`,
          }),
          renderEmailSection({
            title: emailTranslations.homeLoanEstimate.paymentBreakdown,
            body: renderEmailRows([
              {
                label: emailTranslations.homeLoanEstimate.fields.principalInterest,
                value: `$${principalInterest.toLocaleString()}`,
              },
              {
                label: emailTranslations.homeLoanEstimate.fields.propertyTax,
                value: `$${monthlyPropertyTax.toLocaleString()}`,
              },
              {
                label: emailTranslations.homeLoanEstimate.fields.homeInsurance,
                value: `$${monthlyHomeInsurance.toLocaleString()}`,
              },
              ...(monthlyPmi > 0
                ? [
                    {
                      label: emailTranslations.homeLoanEstimate.fields.pmi,
                      value: `$${monthlyPmi.toLocaleString()}`,
                    },
                  ]
                : []),
            ]),
          }),
          renderEmailSection({
            title: emailTranslations.homeLoanEstimate.loanSummary,
            body: renderEmailRows([
              {
                label: emailTranslations.homeLoanEstimate.fields.totalInterest,
                value: `$${totalInterest.toLocaleString()}`,
              },
              {
                label: emailTranslations.homeLoanEstimate.fields.totalCost,
                value: `$${(loanAmount + totalInterest).toLocaleString()}`,
              },
            ]),
          }),
          renderEmailContactCard(
            emailTranslations.homeLoanEstimate.readyToGetPreApproved,
            emailTranslations.homeLoanEstimate.teamReady
          ),
        ],
        footerLines: [
          'Important: This is an automated estimate. Final terms may vary based on credit approval, property appraisal, and other factors.',
          `${emailTranslations.autoLoanEstimate.company} | Licensed Mortgage Broker`,
        ],
        ctaLabel: emailTranslations.homeLoanEstimate.contactUs,
        ctaHref: EMAIL_BRAND.siteUrl,
      });

      // Send email to customer
      await sendMailTraced(
        { traceId, label: 'home_loan_estimate.customer', requestStartMs },
        {
        from: getDefaultFromAddress(),
        to: email,
        subject: emailTranslations.homeLoanEstimate.subject,
        html: homeLoanHtmlMessage,
        }
      );

      // Send notification to business owner
      const ownerHtmlMessage = renderEmailLayout({
        title: 'New Home Loan Estimate Request',
        subtitle: 'Lead summary for Drive Point Exchange',
        sections: [
          renderEmailSection({
            title: 'Customer details',
            body: renderEmailRows([
              { label: 'Customer', value: `${firstName} ${lastName}`.trim() },
              { label: 'Email', value: email },
              { label: 'Phone', value: mobileNumber || 'Not provided' },
              ...(homePromoCode
                ? [{ label: 'Promo Code', value: homePromoCode, accent: true }]
                : []),
            ]),
          }),
          renderEmailSection({
            title: 'Quote request',
            body: renderEmailRows([
              { label: 'Home price', value: `$${homePrice.toLocaleString()}` },
              { label: 'Down payment', value: `$${downPayment.toLocaleString()}` },
              { label: 'Loan amount', value: `$${loanAmount.toLocaleString()}` },
              { label: 'Interest rate', value: `${interestRate}%` },
              { label: 'Loan term', value: `${loanTerm} years` },
            ]),
          }),
          renderEmailHighlight({
            eyebrow: 'Estimated payment',
            title: 'Monthly payment',
            value: `$${monthlyPayment.toLocaleString()}`,
            detail: `${firstName} ${lastName}`.trim(),
          }),
        ],
        footerLines: [
          'Follow up with this customer promptly to review financing options.',
        ],
      });

      await sendMailTraced(
        { traceId, label: 'home_loan_estimate.owner', requestStartMs },
        {
        from: getDefaultFromAddress(),
        to: getOwnerAddress(),
        subject: 'New Home Loan Estimate Request',
        html: ownerHtmlMessage,
        }
      );

      // Save home loan lead to Supabase
      try {
        const supabase = createServiceClient();
        const { error } = await supabase
          .from('home_loan_leads')
          .insert({
            first_name: firstName,
            last_name: lastName,
            email,
            mobile_number: mobileNumber || null,
            home_price: homePrice,
            down_payment: downPayment,
            loan_amount: loanAmount,
            loan_term: loanTerm,
            interest_rate: interestRate,
            property_tax: propertyTax,
            home_insurance: homeInsurance,
            pmi,
            monthly_payment: monthlyPayment,
            total_interest: totalInterest,
            is_agent: homeIsAgent || false,
            sms_consent: homeSmsConsent || false,
            sms_consent_at: homeSmsConsent ? new Date().toISOString() : null,
            sms_consent_source: homeSmsConsent ? 'home_loan_quote_form' : null,
            promo_code: homePromoCode || null,
            ip_address: req.headers.get('x-vercel-forwarded-for') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null,
            user_agent: req.headers.get('user-agent')?.slice(0, 512) || null,
          });

        if (error) {
          console.error('Supabase insert error:', error);
          // Don't fail the request if database insert fails
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Don't fail the request if database insert fails
      }

      return NextResponse.json({ success: true });
    }

    // Handle calculator submissions (refinance logic)
    const {
      name,
      email,
      inputs,
      result,
      isAgent: rawIsAgent,
      smsConsent: rawSmsConsent,
      promoCode: rawPromoCode,
    } = body;
    const isAgent = Boolean(rawIsAgent);
    const smsConsent = isAgent ? false : Boolean(rawSmsConsent);
    const promoCode = typeof rawPromoCode === 'string' ? rawPromoCode.trim() : '';

    // Validate required fields for calculator
    if (!name || !email || !inputs || !result) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (smsConsent && !inputs?.mobileNumber?.trim()) {
      return NextResponse.json(
        { error: 'Mobile number required for SMS consent' },
        { status: 400 }
      );
    }

    // Get email translations
    const emailTranslations = await getEmailTranslations(selectedLanguage);

    const {
      currentMonthlyPayment,
      balanceLeft,
      currentApr,
      remainingTermYears,
      newApr,
      newTermYears,
    } = inputs;

    const {
      newMonthlyPayment,
      monthlySavings,
      currentTotalInterestRemaining,
      newTotalInterest,
      interestSavings,
      balanceLeft: resultBalanceLeft,
    } = result;
    
    // Use currentApr from inputs for display, with fallback to 0 if undefined
    const calculatedCurrentApr = currentApr ?? 0;
    
    // Ensure all numeric values are defined, providing defaults if missing
    const safeRemainingTermYears = remainingTermYears ?? 0;
    const safeNewApr = newApr ?? 0;
    const safeNewTermYears = newTermYears ?? 0;

    // Validate email configuration (Resend or SMTP)
    if (!isEmailConfigured()) {
      console.error('Missing email configuration:', {
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasSmtpUser: !!process.env.SMTP_USER,
        hasSmtpPass: !!process.env.SMTP_PASS,
      });
      return NextResponse.json(
        { error: 'Email service not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const refinanceSavingsHighlight = monthlySavings > 0
      ? renderEmailHighlight({
          eyebrow: emailTranslations.refinanceEstimate.savingsTitle,
          title: 'Estimated monthly savings',
          value: `$${Math.round(monthlySavings).toLocaleString()}/month`,
          detail: 'Lower monthly payment based on this refinance estimate.',
        })
      : monthlySavings < 0
        ? renderEmailHighlight({
            eyebrow: emailTranslations.refinanceEstimate.savingsTitle,
            title: 'Monthly payment increase',
            value: `$${Math.round(Math.abs(monthlySavings)).toLocaleString()}/month`,
            detail: 'This quote would increase the monthly payment compared with the current loan.',
            tone: 'alert',
          })
        : renderEmailHighlight({
            eyebrow: emailTranslations.refinanceEstimate.savingsTitle,
            title: 'Monthly payment change',
            value: '$0/month',
            detail: 'This quote keeps the monthly payment about the same as the current loan.',
            tone: 'neutral',
          });

    const interestDifferenceHighlight = interestSavings > 0
      ? renderEmailHighlight({
          eyebrow: 'Interest savings',
          title: 'Estimated lifetime interest savings',
          value: `$${Math.round(Math.abs(interestSavings)).toLocaleString()}`,
          detail: 'Projected reduction in interest paid over the life of the loan.',
          tone: 'neutral',
        })
      : interestSavings < 0
        ? renderEmailHighlight({
            eyebrow: 'Interest difference',
            title: 'Projected lifetime interest increase',
            value: `$${Math.round(Math.abs(interestSavings)).toLocaleString()}`,
            detail: 'This quote would increase total interest paid over the life of the loan.',
            tone: 'alert',
          })
        : '';

    const htmlMessage = renderEmailLayout({
      title: 'Auto Refinance Comparison',
      subtitle: EMAIL_BRAND.companyName,
      intro: [
        emailTranslations.refinanceEstimate.greeting.replace('{name}', name),
        emailTranslations.refinanceEstimate.thankYou,
      ],
      sections: [
        renderEmailSection({
          title: emailTranslations.refinanceEstimate.currentLoanTitle,
          body: renderEmailRows([
            {
              label: 'Current balance',
              value: `$${Math.round(resultBalanceLeft).toLocaleString()}`,
            },
            {
              label: emailTranslations.refinanceEstimate.fields.monthlyPayment,
              value: `$${Math.round(currentMonthlyPayment).toLocaleString()}`,
            },
            {
              label: emailTranslations.refinanceEstimate.fields.apr,
              value: `${calculatedCurrentApr.toFixed(2)}%`,
            },
            {
              label: emailTranslations.refinanceEstimate.fields.remainingTerm,
              value: `${safeRemainingTermYears % 1 === 0 ? safeRemainingTermYears : safeRemainingTermYears.toFixed(2)} ${safeRemainingTermYears === 1 ? 'year' : 'years'}`,
            },
            {
              label: emailTranslations.refinanceEstimate.fields.interestRemaining,
              value: `$${Math.round(currentTotalInterestRemaining).toLocaleString()}`,
            },
          ]),
        }),
        renderEmailSection({
          title: emailTranslations.refinanceEstimate.newOfferTitle,
          tone: 'brand',
          body: renderEmailRows([
            {
              label: emailTranslations.refinanceEstimate.fields.newMonthlyPayment,
              value: `$${Math.round(newMonthlyPayment).toLocaleString()}`,
              accent: true,
            },
            {
              label: emailTranslations.refinanceEstimate.fields.newApr,
              value: `${safeNewApr.toFixed(2)}%`,
              accent: true,
            },
            {
              label: emailTranslations.refinanceEstimate.fields.newTerm,
              value: `${safeNewTermYears % 1 === 0 ? safeNewTermYears : safeNewTermYears.toFixed(2)} ${safeNewTermYears === 1 ? 'year' : 'years'}`,
            },
            {
              label: emailTranslations.refinanceEstimate.fields.newTotalInterest,
              value: `$${Math.round(newTotalInterest).toLocaleString()}`,
            },
          ]),
        }),
        refinanceSavingsHighlight,
        interestDifferenceHighlight,
        renderEmailContactCard(
          emailTranslations.refinanceEstimate.readyToRefinance,
          emailTranslations.refinanceEstimate.teamReady
        ),
      ].filter(Boolean) as string[],
      footerLines: [
        emailTranslations.refinanceEstimate.bestRegards,
        emailTranslations.refinanceEstimate.teamSignature,
        `Important: ${emailTranslations.refinanceEstimate.disclaimer}`,
      ],
      ctaLabel: 'Review your refinance options',
      ctaHref: EMAIL_BRAND.siteUrl,
    });

    const textMessage = `
🚗 AUTO REFINANCE COMPARISON FROM DRIVE POINT EXCHANGE

${emailTranslations.refinanceEstimate.greeting.replace('{name}', name)}

${emailTranslations.refinanceEstimate.thankYou}

${emailTranslations.refinanceEstimate.currentLoanTitle.toUpperCase()}
• ${emailTranslations.refinanceEstimate.fields.apr}: ${calculatedCurrentApr.toFixed(2)}%
• ${emailTranslations.refinanceEstimate.fields.remainingTerm}: ${safeRemainingTermYears % 1 === 0 ? safeRemainingTermYears : safeRemainingTermYears.toFixed(2)} ${safeRemainingTermYears === 1 ? 'year' : 'years'}
• ${emailTranslations.refinanceEstimate.fields.monthlyPayment}: $${Math.round(currentMonthlyPayment).toLocaleString()}
• ${emailTranslations.refinanceEstimate.fields.interestRemaining}: $${Math.round(currentTotalInterestRemaining).toLocaleString()}

${emailTranslations.refinanceEstimate.newOfferTitle.toUpperCase()}
• ${emailTranslations.refinanceEstimate.fields.newApr}: ${safeNewApr.toFixed(2)}%
• ${emailTranslations.refinanceEstimate.fields.newTerm}: ${safeNewTermYears % 1 === 0 ? safeNewTermYears : safeNewTermYears.toFixed(2)} ${safeNewTermYears === 1 ? 'year' : 'years'}
• ${emailTranslations.refinanceEstimate.fields.newMonthlyPayment}: $${Math.round(newMonthlyPayment).toLocaleString()}
• ${emailTranslations.refinanceEstimate.fields.newTotalInterest}: $${Math.round(newTotalInterest).toLocaleString()}

${emailTranslations.refinanceEstimate.savingsTitle.toUpperCase()}
${monthlySavings > 0 ? `• ${emailTranslations.refinanceEstimate.monthlySavings}: $${Math.round(monthlySavings).toLocaleString()}/month` : `• Monthly Payment ${monthlySavings < 0 ? 'Increase' : 'Change'}: $${Math.round(Math.abs(monthlySavings)).toLocaleString()}/month`}

${interestSavings > 0 ? `• Interest Savings: $${Math.round(Math.abs(interestSavings)).toLocaleString()}` : interestSavings < 0 ? `• Interest Difference: $${Math.round(Math.abs(interestSavings)).toLocaleString()} more` : ''}

NEXT STEPS:
1. Contact our team to discuss refinancing options
2. Complete a full application for final approval
3. Start saving money with better rates!

CONTACT INFORMATION:
📞 Phone: ${EMAIL_BRAND.supportPhone}
📧 Email: ${EMAIL_BRAND.supportEmail}
🌐 Website: ${EMAIL_BRAND.siteUrl.replace(/^https?:\/\//, '')}

${emailTranslations.refinanceEstimate.teamReady}
Contact us today to get started!

${emailTranslations.refinanceEstimate.bestRegards}
${emailTranslations.refinanceEstimate.teamSignature}

---
${emailTranslations.refinanceEstimate.disclaimer}
    `;

    // Send email to customer
    await sendMailTraced(
      { traceId, label: 'refinance.customer', requestStartMs },
      {
      from: getDefaultFromAddress(),
      to: email,
      subject: emailTranslations.refinanceEstimate.subject,
      text: textMessage,
      html: htmlMessage,
      }
    );

    // Send notification to owner
    const ownerMessage = `
🚗 NEW AUTO REFINANCE INQUIRY - DRIVE POINT EXCHANGE

CUSTOMER INFORMATION:
• Name: ${name}
• Email: ${email}
• Phone: ${inputs.mobileNumber || 'Not provided'}
${promoCode ? `• Promo Code: ${promoCode}\n` : ''}
CURRENT LOAN DETAILS:
• Current Balance: $${Math.round(resultBalanceLeft).toLocaleString()}
• Current Monthly Payment: $${Math.round(currentMonthlyPayment).toLocaleString()}
• Current APR: ${calculatedCurrentApr.toFixed(2)}%
• Remaining Term: ${safeRemainingTermYears % 1 === 0 ? safeRemainingTermYears : safeRemainingTermYears.toFixed(2)} ${safeRemainingTermYears === 1 ? 'year' : 'years'}

NEW REFINANCE OFFER:
• New APR: ${safeNewApr.toFixed(2)}%
• New Term: ${safeNewTermYears % 1 === 0 ? safeNewTermYears : safeNewTermYears.toFixed(2)} ${safeNewTermYears === 1 ? 'year' : 'years'}
• New Monthly Payment: $${Math.round(newMonthlyPayment).toLocaleString()}
• New Total Interest: $${Math.round(newTotalInterest).toLocaleString()}

SAVINGS ANALYSIS:
• Monthly Savings: $${Math.round(monthlySavings).toLocaleString()}/month
• Interest Difference: $${interestSavings > 0 ? 'Saving ' : ''}${Math.round(Math.abs(interestSavings)).toLocaleString()}${interestSavings < 0 ? ' more' : ''}

ACTION REQUIRED:
Follow up with this customer within 24 hours to discuss their refinancing options and provide personalized rates.

CONTACT CUSTOMER:
📧 Email: ${email}
${inputs.mobileNumber ? `📞 Phone: ${inputs.mobileNumber}` : ''}

This customer has shown interest in auto refinancing and is ready to save money with better rates.
    `;

    const ownerHtmlMessage = renderEmailLayout({
      title: 'New Refinance Inquiry',
      subtitle: `${name} submitted a refinance request`,
      sections: [
        renderEmailSection({
          title: 'Customer information',
          body: renderEmailRows([
            { label: 'Name', value: name },
            { label: 'Email', value: email },
            { label: 'Phone', value: inputs.mobileNumber || 'Not provided' },
            ...(promoCode
              ? [{ label: 'Promo Code', value: promoCode, accent: true }]
              : []),
          ]),
        }),
        renderEmailSection({
          title: 'Current loan details',
          body: renderEmailRows([
            { label: 'Current balance', value: `$${Math.round(resultBalanceLeft).toLocaleString()}` },
            {
              label: 'Current monthly payment',
              value: `$${Math.round(currentMonthlyPayment).toLocaleString()}`,
            },
            { label: 'Current APR', value: `${calculatedCurrentApr.toFixed(2)}%` },
            {
              label: 'Remaining term',
              value: `${safeRemainingTermYears % 1 === 0 ? safeRemainingTermYears : safeRemainingTermYears.toFixed(2)} ${safeRemainingTermYears === 1 ? 'year' : 'years'}`,
            },
          ]),
        }),
        renderEmailSection({
          title: 'Refinance offer',
          tone: 'brand',
          body: renderEmailRows([
            { label: 'New APR', value: `${safeNewApr.toFixed(2)}%`, accent: true },
            {
              label: 'New term',
              value: `${safeNewTermYears % 1 === 0 ? safeNewTermYears : safeNewTermYears.toFixed(2)} ${safeNewTermYears === 1 ? 'year' : 'years'}`,
            },
            {
              label: 'New monthly payment',
              value: `$${Math.round(newMonthlyPayment).toLocaleString()}`,
              accent: true,
            },
            {
              label: 'New total interest',
              value: `$${Math.round(newTotalInterest).toLocaleString()}`,
            },
          ]),
        }),
        renderEmailHighlight({
          eyebrow: 'Savings analysis',
          title: monthlySavings >= 0 ? 'Estimated monthly savings' : 'Estimated monthly increase',
          value: `$${Math.round(Math.abs(monthlySavings)).toLocaleString()}/month`,
          detail: `Interest difference: $${Math.round(Math.abs(interestSavings)).toLocaleString()}${interestSavings < 0 ? ' more' : interestSavings > 0 ? ' saved' : ''}`,
          tone: monthlySavings < 0 ? 'alert' : 'brand',
        }),
      ],
      footerLines: [
        'Follow up within 24 hours to discuss refinancing options and provide personalized rates.',
      ],
    });

    await sendMailTraced(
      { traceId, label: 'refinance.owner', requestStartMs },
      {
      from: getDefaultFromAddress(),
      to: getOwnerAddress(),
      subject: `New Refinance Inquiry - ${name} (${email})`,
      text: ownerMessage,
      html: ownerHtmlMessage,
      }
    );

    // Save auto refinance lead to Supabase
    try {
      const supabase = createServiceClient();
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const { error } = await supabase
        .from('auto_loan_leads')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email,
          mobile_number: inputs.mobileNumber || null,
          // Refinance Fields
          current_balance: balanceLeft,
          current_apr: calculatedCurrentApr,
          remaining_term_months: safeRemainingTermYears * 12,
          new_apr: safeNewApr,
          new_term_months: safeNewTermYears * 12,
          refi_fees: 0,
          current_monthly_payment: currentMonthlyPayment,
          new_monthly_payment: newMonthlyPayment,
          monthly_savings: monthlySavings,
          lifetime_savings: 0,
          current_total_interest_remaining: currentTotalInterestRemaining,
          new_total_interest: newTotalInterest,
          difference_in_interest: interestSavings,
          is_agent: isAgent || false,
          sms_consent: smsConsent || false,
          sms_consent_at: smsConsent ? new Date().toISOString() : null,
          sms_consent_source: smsConsent ? 'auto_loan_quote_form' : null,
          promo_code: promoCode || null,
          ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null,
          user_agent: req.headers.get('user-agent') || null,
          // Legacy fields (for backward compatibility)
          loan_amount: resultBalanceLeft,
          interest_rate: safeNewApr,
          term_months: safeNewTermYears * 12,
          monthly_payment: newMonthlyPayment,
          total_interest: newTotalInterest,
          total_cost: resultBalanceLeft + newTotalInterest,
          is_manual_rate: false,
        });

      if (error) {
        console.error('Supabase insert error:', error);
        // Don't fail the request if database insert fails
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Don't fail the request if database insert fails
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errObj = (error && typeof error === 'object'
      ? (error as {
          message?: unknown;
          code?: unknown;
          responseCode?: unknown;
          response?: unknown;
          command?: unknown;
        })
      : undefined);

    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof errObj?.message === 'string'
          ? errObj.message
          : 'Unknown error';

    const errorResponse = typeof errObj?.response === 'string' ? errObj.response : '';
    const errorCode = typeof errObj?.code === 'string' ? errObj.code : undefined;
    const responseCode = typeof errObj?.responseCode === 'number' ? errObj.responseCode : undefined;
    const command = typeof errObj?.command === 'string' ? errObj.command : undefined;

    console.error('Email sending error:', {
      traceId,
      message: errorMessage,
      code: errorCode,
      responseCode,
      response: errorResponse,
      command,
    });
    const isNetworkError = errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ENOTFOUND');
    const isGoogleWebLoginRequired = errorMessage.includes('WebLoginRequired') || errorResponse.includes('WebLoginRequired') || errorMessage.includes('Please log in with your web browser');
    const isAuthError = errorMessage.includes('Invalid login') || errorMessage.includes('authentication') || errorCode === 'EAUTH';
    
    let userFriendlyMessage = 'Failed to send email';
    if (isNetworkError) {
      userFriendlyMessage = 'Email service unavailable. Please try again later.';
    } else if (isGoogleWebLoginRequired || (isAuthError && errorResponse.includes('534'))) {
      const isWorkspaceAccount = process.env.SMTP_USER?.includes('@') && !process.env.SMTP_USER?.endsWith('@gmail.com');
      if (isWorkspaceAccount) {
        userFriendlyMessage = 'Google Workspace account requires admin approval for App Passwords. Contact your Workspace administrator to: 1) Enable "Less secure app access" OR allow App Passwords for your account, 2) Visit https://accounts.google.com/DisplayUnlockCaptcha to unlock access, 3) Ensure IMAP is enabled in Gmail settings. If app passwords are disabled by policy, consider using OAuth2 or a different email service.';
      } else {
        userFriendlyMessage = 'Gmail requires security verification. Try these steps: 1) Visit https://accounts.google.com/DisplayUnlockCaptcha and click "Continue" to unlock access, 2) Log into Gmail via browser to clear any security alerts, 3) If still failing, regenerate the App Password at https://myaccount.google.com/apppasswords. This usually happens when Google detects new activity.';
      }
    } else if (isAuthError) {
      userFriendlyMessage = 'Email authentication failed. Please verify your SMTP credentials are correct.';
    } else {
      userFriendlyMessage = `Failed to send email: ${errorMessage}`;
    }
    
    return NextResponse.json(
      { error: userFriendlyMessage },
      { status: 500 }
    );
  }
}