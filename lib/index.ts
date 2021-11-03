/**
 * @fileoverview Best practice rules for Storybook
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import requireIndex from 'requireindex'

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
export const rules = requireIndex(__dirname + '/rules')
export const configs = requireIndex(__dirname + '/configs')
