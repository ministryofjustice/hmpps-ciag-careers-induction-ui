import type { CreateInductionDto } from 'dto'
import toCreateInductionRequest from './createInductionMapper'
import { aCreateLongQuestionSetInductionDto } from '../../testsupport/createInductionDtoTestDataBuilder'
import { aCreateLongQuestionSetInduction } from '../../testsupport/createInductionRequestTestDataBuilder'

describe('createInductionMapper', () => {
  it('should map to CreateInductionRequest given a valid DTO', () => {
    // Given
    const createInductionDto: CreateInductionDto = aCreateLongQuestionSetInductionDto()
    const expectedCreateInductionRequest = aCreateLongQuestionSetInduction()

    // When
    const actual = toCreateInductionRequest(createInductionDto)

    // Then
    expect(actual).toEqual(expectedCreateInductionRequest)
  })
})
