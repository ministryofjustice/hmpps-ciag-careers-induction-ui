import addressLookup from './addressLookup'

/**
 * Functions used to determine the 'mode' a given page is in, where the 'mode' is one of [Mode] (`new`, `edit`, or `update`)
 *
 * Note that `edit` and `update` are subtly different:
 *   * `edit` refers to going back to a given page from the 'check your answers' page.
 *      The context is that of editing answers before they are sent to the API to create the Induction in the first place.
 *   * `update` is used when updating an existing Induction, typically from a 'Change' link on the PLP UI.
 */

/**
 * Returns `true` if the `mode` is `new`
 */
const isCreateMode = (mode: Mode) => mode === Mode.NEW

/**
 * Returns `true` if the `mode` is `edit`
 */
const isEditMode = (mode: Mode) => mode === Mode.EDIT

/**
 * Returns `true` if the `mode` is `update`
 */
const isUpdateMode = (mode: Mode) => mode === Mode.UPDATE

/**
 * Returns the route path to either the 'check your answers' page, or the relevant PLP page.
 * * In the case that the `mode` is update mode, the context is that of updating the Induction from the PLP pages, in
 *   which case the returned value is the relevant PLP page.
 * * In the case that the `mode` is not update mode, the context is that of initially creating an Induction, in which
 *   case the returned value is the CIAG UI `check your answers` page.
 */
const getHubPageByMode = (mode: Mode, id: string, tab?: string) =>
  isUpdateMode(mode) ? addressLookup.learningPlan.profile(id, tab) : addressLookup.createPlan.checkYourAnswers(id)

/**
 * An enumeration of modes used in route path elements.
 */
const enum Mode {
  NEW = 'new',
  EDIT = 'edit',
  UPDATE = 'update',
}

export { isCreateMode, isEditMode, isUpdateMode, getHubPageByMode, Mode }
