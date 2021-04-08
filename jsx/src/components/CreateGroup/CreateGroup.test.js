import React from "react";
import Enzyme, { mount } from "enzyme";
import CreateGroup from "./CreateGroup";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { Provider, useDispatch } from "react-redux";
import { createStore } from "redux";
import { HashRouter } from "react-router-dom";

Enzyme.configure({ adapter: new Adapter() });

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe("CreateGroup Component: ", () => {
  var mockAsync = () =>
    jest.fn().mockImplementation(() => Promise.resolve({ key: "value" }));

  var createGroupJsx = (callbackSpy) => (
    <Provider store={createStore(() => {}, {})}>
      <HashRouter>
        <CreateGroup
          createGroup={callbackSpy}
          refreshGroupsData={callbackSpy}
          history={{ push: () => {} }}
        />
      </HashRouter>
    </Provider>
  );

  beforeEach(() => {
    useDispatch.mockImplementation((callback) => {
      return () => {};
    });
  });

  afterEach(() => {
    useDispatch.mockClear();
  });

  it("Renders", () => {
    let component = mount(createGroupJsx());
    expect(component.find(".container").length).toBe(1);
  });

  it("Calls createGroup and refreshGroupsData on submit", () => {
    let callbackSpy = mockAsync(),
      component = mount(createGroupJsx(callbackSpy)),
      input = component.find("input").first(),
      submit = component.find("#submit").first();
    input.simulate("change", { target: { value: "" } });
    submit.simulate("click");
    expect(callbackSpy).toHaveBeenNthCalledWith(1, "");
    expect(callbackSpy).toHaveBeenNthCalledWith(2);
  });
});
