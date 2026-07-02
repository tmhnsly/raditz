import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileDropzone } from './FileDropzone';

const meta = {
  title: 'Components/Inputs/FileDropzone',
  component: FileDropzone,
  parameters: {
    docs: { description: { component: 'Drag-and-drop file input with click-to-browse and a file list (UI only).' } },
  },
  argTypes: {
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    maxSize: { control: 'number' },
    hint: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    accept: 'image/*,.pdf',
    multiple: true,
    hint: 'PNG, JPG or PDF up to 5MB',
  },
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);
    return <FileDropzone {...args} value={files} onValueChange={setFiles} />;
  },
};
