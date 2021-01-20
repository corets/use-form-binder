import React from "react"
import { Form } from "@corets/form"
import { useFormBinder } from "./useFormBinder"
import { mount } from "enzyme"
import { FormBinder } from "./FormBinder"

describe("useFormBinder", () => {
  it("returns a form binder", () => {
    const form = new Form()
    let receivedFormBinder

    const Test = () => {
      receivedFormBinder = useFormBinder(form)

      return null
    }

    const wrapper = mount(<Test />)

    expect(receivedFormBinder instanceof FormBinder).toBe(true)
  })
})
