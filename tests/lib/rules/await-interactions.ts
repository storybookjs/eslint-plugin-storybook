/**
 * @fileoverview Interactions should be awaited
 * @author Yann Braga
 */
'use strict'

const { default: dedent } = require('ts-dedent')
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/await-interactions'),
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
