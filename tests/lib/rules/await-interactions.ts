/**
 * @fileoverview Interactions should be awaited
 * @author Yann Braga
 */
'use strict'

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'dedent'.
const { default: dedent } = require('ts-dedent')
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'rule'.
const rule = require('../../../lib/rules/await-interactions'),
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ruleTester... Remove this comment to see the full error message
  ruleTester = require('../../utils/rule-tester')

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
ruleTester.run('await-interactions', rule, {
  valid: [
    dedent`
        Basic.play = () => {
          await userEvent.click(button)
        }
      `,
    dedent`
        WithModalOpen.play = async ({ canvasElement }) => {
          const MyButton = await canvas.findByRole('button')
        }
      `,
  ],
  invalid: [
    {
      code: dedent(`
          WithModalOpen.play = async ({ canvasElement }) => {
            const canvas = within(canvasElement)

            const foodItem = canvas.findByText(/Cheeseburger/i)
            userEvent.click(foodItem)

            const modalButton = canvas.findByLabelText('increase quantity by one')
            userEvent.click(modalButton)
          }
        `),
      errors: [
        {
          messageId: 'interactionShouldBeAwaited',
          data: { method: 'findByText' },
        },
        {
          messageId: 'interactionShouldBeAwaited',
          data: { method: 'userEvent' },
        },
        {
          messageId: 'interactionShouldBeAwaited',
          data: { method: 'findByLabelText' },
        },
        {
          messageId: 'interactionShouldBeAwaited',
          data: { method: 'userEvent' },
        },
      ],
    },
  ],
})
