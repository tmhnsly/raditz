import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TagInput } from './TagInput';

const meta = {
  title: 'Components/Forms/TagInput',
  component: TagInput,
  parameters: {
    docs: { description: { component: 'Multi-value text input — Enter/comma adds, Backspace removes.' } },
  },
  argTypes: {
    placeholder: { control: 'text' },
    max: { control: 'number' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    placeholder: 'Add tag…',
    suggestions: ['react', 'typescript', 'design', 'storybook'],
  },
  render: (args) => {
    const [tags, setTags] = useState<string[]>(['react']);
    return <TagInput {...args} value={tags} onChange={setTags} />;
  },
};
