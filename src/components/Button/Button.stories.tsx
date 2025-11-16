import { Button } from "./Button";

const meta = {
  title: "Test/Button",
  component: Button,
  argTypes: {
    backgroundColor: { control: "color" },
  },
};

export default meta;

export const Primary = {
  args: {
    children: "Button",
    backgroundColor: "#fff",
    borderRadius: "4px",
  },
};
