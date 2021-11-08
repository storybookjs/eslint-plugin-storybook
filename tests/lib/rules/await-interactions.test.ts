/**
 * @fileoverview Interactions should be awaited
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import dedent from 'ts-dedent'

import rule from '../../../lib/rules/await-interactions'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
ruleTester.run('await-interactions', rule, {
  valid: [
    dedent`
      Basic.play = async () => {
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
