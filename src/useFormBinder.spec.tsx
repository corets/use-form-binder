import React from "react"
import { Form } from "@corets/form"
import { useFormBinder } from "./useFormBinder"
import { FormBinder } from "./FormBinder"
import { render } from "@testing-library/react"

describe("useFormBinder", () => {
  it("returns a form binder", () => {
    const form = new Form()
    let receivedFormBinder

    const Test = () => {
      receivedFormBinder = useFormBinder(form)

      return null
    }

    render(<Test />)

    expect(receivedFormBinder instanceof FormBinder).toBe(true)
  })
})
