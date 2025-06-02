import type { CreateOrUpdateInductionDto } from 'dto'
import toUpdateInductionRequest from './updateInductionRequestMapper'
import { anUpdateLongQuestionSetInductionDto } from '../../testsupport/updateInductionDtoTestDataBuilder'
import { anUpdateLongQuestionSetInduction } from '../../testsupport/updateInductionRequestTestDataBuilder'

describe('updateInductionMapper', () => {
  it('should map to UpdateInductionRequest given a valid DTO', () => {
    // Given
    const updateInductionDto: CreateOrUpdateInductionDto = anUpdateLongQuestionSetInductionDto()
    const expectedUpdateInductionRequest = anUpdateLongQuestionSetInduction()

    // When
    const actual = toUpdateInductionRequest(updateInductionDto)

    // Then
    expect(actual).toEqual(expectedUpdateInductionRequest)
  })
})
