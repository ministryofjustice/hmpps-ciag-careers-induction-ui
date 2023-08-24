import type { Router } from 'express'
import { getSessionData } from '../../utils/session'

// Route to securely redirect to external pages
export default (router: Router) => {
  router.get('/redirect/:uid', (req, res, _): void => {
    const { uid } = req.params

    // Get Url to redirect to
    const url = getSessionData(req, ['redirect', uid])

    // Render page with redirect code
    res.render('pages/redirect/index', { url })
  })
}
