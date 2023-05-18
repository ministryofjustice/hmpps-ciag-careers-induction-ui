import { plainToClass } from 'class-transformer'
import NeurodivergenceViewModel from './neurodivergenceViewModel'

describe('NeurodivergenceViewModel', () => {
  const neurodivergenceJson = {
    neurodivergenceSelfDeclared: ['dyslexia', 'ADHD'],
    selfDeclaredDate: '2022-04-20T09:00:00Z',
    neurodivergenceAssessed: ['dyspraxia'],
    assessmentDate: '2022-04-21T09:00:00Z',
    neurodivergenceSupport: ['dyscalculia'],
    supportDate: '2022-04-22T09:00:00Z',
  }

  it('transforms JSON to NeurodivergenceViewModel instance', () => {
    const neurodivergenceViewModel = plainToClass(NeurodivergenceViewModel, neurodivergenceJson)

    expect(neurodivergenceViewModel.neurodivergenceSelfDeclared).toEqual(
      neurodivergenceJson.neurodivergenceSelfDeclared,
    )
    expect(neurodivergenceViewModel.selfDeclaredDate).toBe('20 Apr 2022')
    expect(neurodivergenceViewModel.neurodivergenceAssessed).toEqual(neurodivergenceJson.neurodivergenceAssessed)
    expect(neurodivergenceViewModel.assessmentDate).toBe('21 Apr 2022')
    expect(neurodivergenceViewModel.neurodivergenceSupport).toEqual(neurodivergenceJson.neurodivergenceSupport)
    expect(neurodivergenceViewModel.supportDate).toBe('22 Apr 2022')
  })
})
