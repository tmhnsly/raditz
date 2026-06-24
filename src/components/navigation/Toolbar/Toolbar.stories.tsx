import type { Meta, StoryObj } from '@storybook/react';
import { Toolbar } from './Toolbar';
import { ToggleGroup } from '../../actions/ToggleGroup';
import { IconButton } from '../../actions/IconButton';
import { Separator } from '../../layout/Separator';

const meta = {
  title: 'Components/Navigation/Toolbar',
  component: Toolbar,
  parameters: {
    docs: { description: { component: 'Horizontal container that groups actions — fill it with Toggles, ToggleGroups, IconButtons and Separators.' } },
  },
} satisfies Meta;
export default meta;

type Story = StoryObj;

/** A text-formatting toolbar: a multi-select format group, a single-select
 * alignment group, and a few icon actions — all real, interactive components. */
export const Default: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Toolbar aria-label="Formatting">
        <ToggleGroup
          type="multiple"
          defaultValue={['bold']}
          items={[
            { value: 'bold', label: 'B' },
            { value: 'italic', label: 'I' },
            { value: 'underline', label: 'U' },
          ]}
        />
        <Separator orientation="vertical" />
        <ToggleGroup
          type="single"
          defaultValue="left"
          items={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
        />
        <Separator orientation="vertical" />
        <IconButton aria-label="Insert link" icon="link" />
        <IconButton aria-label="Insert image" icon="image" />
        <IconButton aria-label="Bulleted list" icon="list" />
      </Toolbar>
    </div>
  ),
};
