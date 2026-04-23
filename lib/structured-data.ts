export const BASE_URL = 'https://www.drivepointexchange.com'

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Drive Point Exchange',
    description: 'Professional auto financing solutions including auto loans, refinancing, vehicle coverage, home refinancing, and insurance consultation services.',
    image: `${BASE_URL}/logo.png`,
    logo: `${BASE_URL}/logo.png`,
    url: BASE_URL,
    telephone: '+1-888-351-0782',
    email: 'support@drivepointexchange.com',
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-888-351-0782',
      contactType: 'customer service',
      email: 'support@drivepointexchange.com',
      availableLanguage: ['English', 'Spanish', 'Polish', 'Italian', 'French'],
    },
    sameAs: [
      'https://www.facebook.com/drivepointexchange',
      'https://www.instagram.com/drivepointexchange',
      'https://www.tiktok.com/@drivepointexchange',
      'https://www.youtube.com/@drivepointexchange',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    foundingDate: '2012',
    numberOfEmployees: '50-100',
    serviceType: [
      'Auto Loan Refinancing',
      'Vehicle Coverage',
      'Vehicle Coverage Certifications',
      'Home Refinancing',
      'Insurance Consultation',
    ],
  }
}

export function getServiceSchema(service: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      '@type': 'Organization',
      name: 'Drive Point Exchange',
      url: BASE_URL,
    },
    areaServed: 'United States',
    serviceType: service.name,
  }
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
