const ciagPrisoners = {
  content: [
    {
      prisonerNumber: 'A0670DZ',
      bookingId: '1204342',
      bookNumber: '41350A',
      firstName: 'MILO',
      lastName: 'CATTUS',
      dateOfBirth: '1999-01-01',
      gender: 'Male',
      youthOffender: false,
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'V',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: '3-2-005',
      aliases: [],
      alerts: [Array],
      legalStatus: 'RECALL',
      imprisonmentStatus: '14FTRHDC_ORA',
      imprisonmentStatusDescription: '14 Day Fixed Term Recall from HDC',
      recall: true,
      indeterminateSentence: false,
      releaseDate: '2023-05-28',
      confirmedReleaseDate: '2023-05-28',
      sentenceExpiryDate: '2023-05-26',
      nonDtoReleaseDate: '2023-05-13',
      nonDtoReleaseDateType: 'ARD',
      receptionDate: '2023-01-24',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
      currentIncentive: [Object],
    },
    {
      prisonerNumber: 'A0772DZ',
      bookingId: '1204443',
      bookNumber: '41451A',
      firstName: 'JOHN',
      lastName: 'DAVIES',
      dateOfBirth: '1972-03-01',
      gender: 'Male',
      youthOffender: false,
      status: 'ACTIVE IN',
      lastMovementTypeCode: 'ADM',
      lastMovementReasonCode: 'N',
      inOutStatus: 'IN',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: '4-3-024',
      aliases: [],
      alerts: [],
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'RECEP_DET',
      imprisonmentStatusDescription: 'Determinate sentence (reception)',
      recall: false,
      indeterminateSentence: false,
      releaseDate: '2023-05-28',
      confirmedReleaseDate: '2023-05-28',
      sentenceExpiryDate: '2023-05-26',
      nonDtoReleaseDate: '2023-05-13',
      nonDtoReleaseDateType: 'ARD',
      receptionDate: '2023-01-27',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
      currentIncentive: [Object],
    },
    {
      prisonerNumber: 'A1749DZ',
      bookingId: '1205481',
      bookNumber: '42484A',
      firstName: 'JOYCE',
      lastName: 'GLEASON',
      dateOfBirth: '1953-07-19',
      gender: 'Female',
      youthOffender: false,
      status: 'ACTIVE OUT',
      lastMovementTypeCode: 'TAP',
      lastMovementReasonCode: '1',
      inOutStatus: 'OUT',
      prisonId: 'MDI',
      prisonName: 'Moorland (HMP & YOI)',
      cellLocation: 'RECP',
      aliases: [],
      alerts: [],
      legalStatus: 'SENTENCED',
      imprisonmentStatus: 'SENT03',
      imprisonmentStatusDescription: 'Adult Imprisonment Without Option CJA03',
      recall: false,
      indeterminateSentence: false,
      releaseDate: '2023-05-28',
      confirmedReleaseDate: '2023-05-28',
      sentenceExpiryDate: '2023-05-26',
      nonDtoReleaseDate: '2023-05-13',
      nonDtoReleaseDateType: 'ARD',
      receptionDate: '2023-03-10',
      locationDescription: 'Moorland (HMP & YOI)',
      restrictedPatient: false,
      currentIncentive: [Object],
    },
  ],
  pageable: {
    sort: { empty: true, sorted: false, unsorted: true },
    offset: 0,
    pageNumber: 0,
    pageSize: 3,
    paged: true,
    unpaged: false,
  },
  totalElements: 1041,
  last: false,
  totalPages: 347,
  size: 3,
  number: 0,
  sort: { empty: true, sorted: false, unsorted: true },
  first: true,
  numberOfElements: 3,
  empty: false,
}

const ciagPrisoners2 = {
  pageable: {
    sort: { empty: true, sorted: false, unsorted: true },
    offset: 0,
    pageSize: 20,
    pageNumber: 0,
    paged: true,
    unpaged: false,
  },
  totalElements: 2,
  last: true,
  totalPages: 0,
  size: 20,
  number: 0,
  sort: { empty: true, sorted: false, unsorted: true },
  first: true,
  numberOfElements: 2,
  empty: false,
  content: [
    {
      prisonerNumber: 'A0011DZ',
      firstName: 'Chesley',
      lastName: 'Bernhard',
      releaseDate: 'N/A',
      nonDtoReleaseDateType: undefined,
      receptionDate: '13 Dec 2022',
    },
    {
      prisonerNumber: 'A0763DZ',
      firstName: 'Calvin',
      lastName: 'Nicolas',
      releaseDate: 'N/A',
      nonDtoReleaseDateType: undefined,
      receptionDate: '27 Jan 2023',
    },
  ],
}

export default { ciagPrisoners }
