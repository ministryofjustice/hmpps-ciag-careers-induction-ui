const ciagPrisoners = {
  content: [
    {
      prisonerNumber: 'A0011DZ',
      firstName: 'Chesley',
      lastName: 'Bernhard',
      releaseDate: 'N/A',
      nonDtoReleaseDateType: 'PRRD',
      receptionDate: '13 Dec 2022',
    },
    {
      prisonerNumber: 'A0763DZ',
      firstName: 'Calvin',
      lastName: 'Nicolas',
      releaseDate: 'N/A',
      nonDtoReleaseDateType: 'PRRD',
      receptionDate: '27 Jan 2023',
    },
    {
      prisonerNumber: 'A1350DZ',
      firstName: 'David',
      lastName: 'Winchurch',
      releaseDate: 'N/A',
      nonDtoReleaseDateType: 'PRRD',
      receptionDate: '16 Feb 2023',
    },
  ],
}

const ciagList = {
  prisonerSearchResults: {
    '0': {
      prisonerNumber: 'A0011DZ',
      firstName: 'Chesley',
      lastName: 'Bernhard',
      releaseDate: 'N/A',
      receptionDate: '13 Dec 2022',
    },
    '1': {
      prisonerNumber: 'A0763DZ',
      firstName: 'Calvin',
      lastName: 'Nicolas',
      releaseDate: 'N/A',
      receptionDate: '27 Jan 2023',
    },
    '2': {
      prisonerNumber: 'A1350DZ',
      firstName: 'David',
      lastName: 'Winchurch',
      releaseDate: 'N/A',
      receptionDate: '16 Feb 2023',
    },
  },
  sort: '',
  order: '',
  paginationData: {
    results: {
      from: 1,
      to: 20,
      count: 1033,
    },
    previous: null,
    next: {
      text: 'Next',
      href: 'http://localhost:3000/?page=2',
    },
    items: [
      {
        text: 1,
        href: 'http://localhost:3000/?page=1',
        selected: true,
      },
      {
        text: 2,
        href: 'http://localhost:3000/?page=2',
        selected: false,
      },
    ],
  },
  searchTerm: '',
}

export default { ciagList, ciagPrisoners }
