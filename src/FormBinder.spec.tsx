import React from "react"
import { FormBinder, useFormBinder } from "./index"
import { createTimeout } from "@corets/promise-helpers"
import { createForm } from "@corets/form"
import { useForm } from "@corets/use-form"
import { act, fireEvent, render, screen } from "@testing-library/react"

describe("FormBinder", () => {
  it("binds submit", async () => {
    const handler = jest.fn()
    const validator = jest.fn()
    const form = createForm({})
      .handler(handler)
      .validator(validator)
      .config({ debounce: 0 })
    const bind = new FormBinder(form)

    const Test = () => {
      return (
        <form role="form" {...bind.form()}>
          <button type="submit">click</button>
        </form>
      )
    }

    render(<Test />)

    const target = screen.getByRole("form")

    fireEvent.submit(target)

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
      .config({ debounce: 0 })
    const bind = new FormBinder(form)

    const Test = () => {
      return (
        <form role="form" {...bind.form({ validate: false })}>
          <button type="submit">click</button>
        </form>
      )
    }

    render(<Test />)

    const target = screen.getByRole("form")

    fireEvent.submit(target)

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
      .config({ debounce: 0 })
    const bind = new FormBinder(form)

    const Test = () => {
      return (
        <form role="form">
          <button {...bind.button()} type="submit">
            click
          </button>
        </form>
      )
    }

    render(<Test />)

    const target = screen.getByRole("button")

    fireEvent.click(target)

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
      .config({ debounce: 0 })
    const bind = new FormBinder(form)

    const Test = () => {
      return (
        <form role="form">
          <button {...bind.button({ validate: false })} type="submit">
            click
          </button>
        </form>
      )
    }

    render(<Test />)

    const target = screen.getByRole("button")

    fireEvent.click(target)

    await createTimeout(0)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(validator).toHaveBeenCalledTimes(0)
  })

  it("disables submit button during submit by default", async () => {
    const form = createForm({}).config({ debounce: 0 })
    const bind = new FormBinder(form)

    expect(bind.button().disabled).toBe(false)

    form.setSubmitting(true)

    expect(bind.button().disabled).toBe(true)

    form.setSubmitting(false)

    expect(bind.button().disabled).toBe(false)

    form.setSubmitting(true)

    expect(bind.button({ disableOnSubmit: false }).disabled).toBe(false)

    form.setSubmitting(false)

    expect(bind.button({ disableOnSubmit: false }).disabled).toBe(false)
  })

  it("binds input", async () => {
    const form = createForm({ foo: "bar" }).config({ debounce: 0 })

    const Test = () => {
      const bind = useFormBinder(useForm(form))

      return <input {...bind.input("foo")} />
    }

    render(<Test />)

    const target = screen.getByRole("textbox")

    expect(target.getAttribute("name")).toBe("foo")
    expect(target.getAttribute("value")).toBe("bar")

    fireEvent.change(target, { target: { value: "baz" } })

    await act(() => createTimeout(50))

    expect(target.getAttribute("value")).toBe("baz")
    expect(form.getAt("foo")).toBe("baz")
  })

  it("binds select", async () => {
    const form = createForm({ foo: "bar" }).config({ debounce: 0 })

    const Test = () => {
      const bind = useFormBinder(useForm(form))

      return (
        <select data-testid="select" {...bind.select("foo")}>
          <option value="bar" data-testid="option1" />
          <option value="baz" data-testid="option2" />
        </select>
      )
    }

    render(<Test />)

    await act(() => createTimeout(50))

    const target = screen.getByTestId("select")
    const option1 = screen.getByTestId("option1") as HTMLOptionElement
    const option2 = screen.getByTestId("option2") as HTMLOptionElement

    expect(target).toHaveAttribute("name", "foo")
    expect(option1.selected).toBe(true)

    fireEvent.change(target, { target: { value: "baz" } })

    await act(() => createTimeout(50))

    expect(option2.selected).toBe(true)
    expect(form.getAt("foo")).toBe("baz")
  })

  it("binds checkbox", async () => {
    const form = createForm({ foo: false }).config({ debounce: 0 })

    const Test = () => {
      const bind = useFormBinder(useForm(form))

      return <input {...bind.checkbox("foo")} type="checkbox" />
    }

    render(<Test />)

    const target = screen.getByRole("checkbox") as HTMLInputElement

    expect(target).toHaveAttribute("name", "foo")
    expect(target.checked).toBe(false)

    fireEvent.click(target)

    await act(() => createTimeout(50))

    expect(target.checked).toBe(true)
    expect(form.getAt("foo")).toBe(true)
  })

  it("binds radio", async () => {
    const form = createForm({ foo: "b" }).config({ debounce: 0 })

    const Test = () => {
      const bind = useFormBinder(useForm(form))

      return <input {...bind.radio("foo", "a")} type="radio" />
    }

    render(<Test />)

    const target = screen.getByRole("radio") as HTMLInputElement

    expect(target).toHaveAttribute("name", "foo")
    expect(target.checked).toBe(false)

    fireEvent.click(target)

    await act(() => createTimeout(50))

    expect(target.checked).toBe(true)
    expect(form.getAt("foo")).toBe("a")

    act(() => form.setAt("foo", "b"))

    expect(target.checked).toBe(false)
  })
})
