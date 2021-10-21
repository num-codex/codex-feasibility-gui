import { Query, QueryOnlyV1, QueryOnlyV2 } from '../model/api/query/query'
import { Criterion, CriterionOnlyV1, CriterionOnlyV2 } from '../model/api/query/criterion'
import { ObjectHelper } from './ObjectHelper'
import { OperatorOptions } from '../model/api/query/valueFilter'

// translates a query with groups to the agreed format of queries in version 1 (without groups)
export class ApiTranslator {
  translateToV1(query: Query): QueryOnlyV1 {
    const result = new QueryOnlyV1()

    result.display = query.display
    const exclusionCriteria = ObjectHelper.clone(query.groups[0].exclusionCriteria)
    const inclusionCriteria = ObjectHelper.clone(query.groups[0].inclusionCriteria)

    result.inclusionCriteria = this.translateCritGroupV1(inclusionCriteria)

    if (exclusionCriteria.length > 0) {
      result.exclusionCriteria = this.translateCritGroupV1(exclusionCriteria)
    } else {
      result.exclusionCriteria = undefined
    }

    return result
  }

  private translateCritGroupV1(inclusionCriteria: Criterion[][]): CriterionOnlyV1[][] {
    const result: CriterionOnlyV1[][] = []
    inclusionCriteria.forEach((criterionArray) => {
      const innerArrayV1: CriterionOnlyV1[] = []
      criterionArray.forEach((criterion) => {
        const criterionV1 = new CriterionOnlyV1()
        criterionV1.termCode = criterion.termCodes[0]
        criterionV1.timeRestriction = criterion.timeRestriction
        if (criterion.valueFilters.length > 0) {
          criterionV1.valueFilter = criterion.valueFilters[0]
          criterionV1.valueFilter.valueDefinition = undefined
        }

        this.removeNonApiFieldsV1(criterionV1)
        innerArrayV1.push(criterionV1)
      })
      result.push(innerArrayV1)
    })

    return result
  }

  // noinspection JSMethodCanBeStatic
  private removeNonApiFieldsV1(criterion: CriterionOnlyV1): void {
    if (criterion.valueFilter) {
      criterion.valueFilter.valueDefinition = null
      criterion.valueFilter.max = undefined
      criterion.valueFilter.min = undefined
      criterion.valueFilter.precision = undefined

      if (criterion.valueFilter.type === OperatorOptions.CONCEPT) {
        criterion.valueFilter.comparator = undefined
        criterion.valueFilter.maxValue = undefined
        criterion.valueFilter.minValue = undefined
        criterion.valueFilter.value = undefined
        criterion.valueFilter.unit = undefined
      } else if (criterion.valueFilter.type === OperatorOptions.QUANTITY_RANGE) {
        criterion.valueFilter.comparator = undefined
        criterion.valueFilter.value = undefined
        criterion.valueFilter.selectedConcepts = undefined
        if (criterion.valueFilter.unit.code === '') {
          criterion.valueFilter.unit = undefined
        }
      } else if (criterion.valueFilter.type === OperatorOptions.QUANTITY_COMPARATOR) {
        criterion.valueFilter.minValue = undefined
        criterion.valueFilter.maxValue = undefined
        criterion.valueFilter.selectedConcepts = undefined
        if (criterion.valueFilter.unit.code === '') {
          criterion.valueFilter.unit = undefined
        }
      }
    }
  }

  translateToV2(query: Query): QueryOnlyV2 {
    const result = new QueryOnlyV2()

    result.display = query.display
    const exclusionCriteria = ObjectHelper.clone(query.groups[0].exclusionCriteria)
    const inclusionCriteria = ObjectHelper.clone(query.groups[0].inclusionCriteria)

    result.inclusionCriteria = this.translateCritGroupV2(inclusionCriteria)

    if (exclusionCriteria.length > 0) {
      result.exclusionCriteria = this.translateCritGroupV2(exclusionCriteria)
    } else {
      result.exclusionCriteria = undefined
    }

    return result
  }

  private translateCritGroupV2(inclusionCriteria: Criterion[][]): CriterionOnlyV2[][] {
    const result: CriterionOnlyV2[][] = []
    inclusionCriteria.forEach((criterionArray) => {
      const innerArrayV2: CriterionOnlyV2[] = []
      criterionArray.forEach((criterion) => {
        const criterionV2 = new CriterionOnlyV2()
        criterionV2.termCodes = criterion.termCodes
        criterionV2.timeRestriction = criterion.timeRestriction
        if (criterion.valueFilters.length > 0) {
          criterionV2.valueFilter = criterion.valueFilters[0]
          criterionV2.valueFilter.valueDefinition = undefined
        }

        // this.removeNonApiFieldsV2(criterionV2)
        innerArrayV2.push(criterionV2)
      })
      result.push(innerArrayV2)
    })

    return result
  }

  // noinspection JSMethodCanBeStatic
  private removeNonApiFieldsV2(criterion: CriterionOnlyV2): void {
    if (criterion.valueFilter) {
      criterion.valueFilter.valueDefinition = null
      criterion.valueFilter.max = undefined
      criterion.valueFilter.min = undefined
      criterion.valueFilter.precision = undefined

      if (criterion.valueFilter.type === OperatorOptions.CONCEPT) {
        criterion.valueFilter.comparator = undefined
        criterion.valueFilter.maxValue = undefined
        criterion.valueFilter.minValue = undefined
        criterion.valueFilter.value = undefined
        criterion.valueFilter.unit = undefined
      } else if (criterion.valueFilter.type === OperatorOptions.QUANTITY_RANGE) {
        criterion.valueFilter.comparator = undefined
        criterion.valueFilter.value = undefined
        criterion.valueFilter.selectedConcepts = undefined
        if (criterion.valueFilter.unit.code === '') {
          criterion.valueFilter.unit = undefined
        }
      } else if (criterion.valueFilter.type === OperatorOptions.QUANTITY_COMPARATOR) {
        criterion.valueFilter.minValue = undefined
        criterion.valueFilter.maxValue = undefined
        criterion.valueFilter.selectedConcepts = undefined
        if (criterion.valueFilter.unit.code === '') {
          criterion.valueFilter.unit = undefined
        }
      }
    }
  }
}
