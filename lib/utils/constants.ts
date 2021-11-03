// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CATEGORY_I... Remove this comment to see the full error message
const CATEGORY_ID = {
  CSF: 'csf',
  CSF_STRICT: 'csf-strict',
  RECOMMENDED: 'recommended',
  ADDON_INTERACTIONS: 'addon-interactions',
}

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  CATEGORY_ID,
}
