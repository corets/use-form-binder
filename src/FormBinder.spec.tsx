import React from "react"
import { FormBinder, useFormBinder } from "./index"
import { mount } from "enzyme"
import { act } from "react-dom/test-utils"
import { createTimeout } from "@corets/promise-helpers"
import { createForm } from "@corets/form"
import { useForm } from "@corets/use-form"

describe("FormBinder", () => {
  it("binds submit", async () => {
    const handler = jest.fn()
    const validator = jest.fn()
    const form = createForm({})
      .handler(handler)
      .validator(validator)
      .configure({ debounceChanges: 0 })
    const bind = new FormBinder(form)

    const Test = () => {
      return (
        <form {...bind.form()}>
          <button type="submit">click</button>
        </form>
      )
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("form")

    target().simulate("submit")

    await createTimeout(0)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(validator).toHaveBeenCalledTimes(1)
  })

  it("binds submit without validate", async () => {
    const handler = jest.fn()
    const validator = jest.fn()
    const form = createForm({})
      .handler(handler)
      .validator(validator)
      .configure({ debounceChanges: 0 })
    const bind = new FormBinder(form)

    const Test = () => {
      return (
        <form {...bind.form({ validate: false })}>
          <button type="submit">click</button>
        </form>
      )
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("form")

    target().simulate("submit")

    await createTimeout(0)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(validator).toHaveBeenCalledTimes(0)
  })

  it("binds submit button", async () => {
    const handler = jest.fn()
    const validator = jest.fn()
    const form = createForm({})
      .handler(handler)
      .validator(validator)
      .configure({ debounceChanges: 0 })
    const bind = new FormBinder(form)

    const Test = () => {
      return (
        <form>
          <button {...bind.button()} type="submit">
            click
          </button>
        </form>
      )
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("button")

    target().simulate("click")

    await createTimeout(0)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(validator).toHaveBeenCalledTimes(1)
  })

  it("binds submit button without validate", async () => {
    const handler = jest.fn()
    const validator = jest.fn()
    const form = createForm({})
      .handler(handler)
      .validator(validator)
      .configure({ debounceChanges: 0 })
    const bind = new FormBinder(form)

    const Test = () => {
      return (
        <form>
          <button {...bind.button({ validate: false })} type="submit">
            click
          </button>
        </form>
      )
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("button")

    target().simulate("click")

    await createTimeout(0)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(validator).toHaveBeenCalledTimes(0)
  })

  it("disables submit button during submit by default", async () => {
    const form = createForm({}).configure({ debounceChanges: 0 })
    const bind = new FormBinder(form)

    expect(bind.button().disabled).toBe(false)

    form.submitting.set(true)

    expect(bind.button().disabled).toBe(true)

    form.submitting.set(false)

    expect(bind.button().disabled).toBe(false)

    form.submitting.set(true)

    expect(bind.button({ disableOnSubmit: false }).disabled).toBe(false)

    form.submitting.set(false)

    expect(bind.button({ disableOnSubmit: false }).disabled).toBe(false)
  })

  it("binds input", async () => {
    const form = createForm({ foo: "bar" }).configure({ debounceChanges: 0 })

    const Test = () => {
      const bind = useFormBinder(useForm(form))

      return <input {...bind.input("foo")} />
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("input")

    expect(target().prop("name")).toBe("foo")
    expect(target().prop("value")).toBe("bar")

    target().simulate("change", { target: { value: "baz" } })

    expect(target().prop("value")).toBe("baz")
    expect(form.getAt("foo")).toBe("baz")
  })

  it("binds select", async () => {
    const form = createForm({ foo: "bar" }).configure({ debounceChanges: 0 })

    const Test = () => {
      const bind = useFormBinder(useForm(form))

      return <select {...bind.select("foo")} />
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("select")

    expect(target().prop("name")).toBe("foo")
    expect(target().prop("value")).toBe("bar")

    target().simulate("change", { target: { value: "baz" } })

    expect(target().prop("value")).toBe("baz")
    expect(form.getAt("foo")).toBe("baz")
  })

  it("binds checkbox", async () => {
    const form = createForm({ foo: false }).configure({ debounceChanges: 0 })

    const Test = () => {
      const bind = useFormBinder(useForm(form))

      return <input {...bind.checkbox("foo")} type="checkbox" />
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("input")

    expect(target().prop("name")).toBe("foo")
    expect(target().prop("checked")).toBe(false)

    target().simulate("change", { target: { checked: true } })

    expect(target().prop("checked")).toBe(true)
    expect(form.getAt("foo")).toBe(true)
  })

  it("binds radio", async () => {
    const form = createForm({ foo: "b" }).configure({ debounceChanges: 0 })

    const Test = () => {
      const bind = useFormBinder(useForm(form))

      return <input {...bind.radio("foo", "a")} type="radio" />
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("input")

    expect(target().prop("name")).toBe("foo")
    expect(target().prop("checked")).toBe(false)

    target().simulate("change", { value: "a" })

    expect(target().prop("checked")).toBe(true)
    expect(form.getAt("foo")).toBe("a")

    act(() => form.setAt("foo", "b"))
    wrapper.update()

    expect(target().prop("checked")).toBe(false)
  })

  it("binds radio without value", async () => {
    const form = createForm({ foo: false }).configure({ debounceChanges: 0 })

    const Test = () => {
      const bind = useFormBinder(useForm(form))

      return <input {...bind.radio("foo")} type="radio" />
    }

    const wrapper = mount(<Test />)
    const target = () => wrapper.find("input")

    expect(target().prop("name")).toBe("foo")
    expect(target().prop("checked")).toBe(false)

    target().simulate("change")

    expect(target().prop("checked")).toBe(true)
    expect(form.getAt("foo")).toBe(true)

    act(() => form.setAt("foo", "yolo"))
    wrapper.update()

    expect(target().prop("checked")).toBe(false)
  })
})
