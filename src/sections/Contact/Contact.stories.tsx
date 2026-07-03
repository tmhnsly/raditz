import type { Meta, StoryObj } from '@storybook/react';
import { ContactA } from './Contact';
import { Button } from '../../components/actions/Button';

const meta: Meta<typeof ContactA> = { title: 'Sections/Contact', component: ContactA };
export default meta;
type Story = StoryObj<typeof ContactA>;

export const A_Split: Story = {
  name: 'A · Split',
  args: {
    eyebrow: 'Contact',
    heading: 'Get in touch',
    lede: 'Questions about bookings, availability or the space itself — send a message and we will get back within one working day.',
    details: [
      { label: 'Email', value: 'hello@studio.com', href: 'mailto:hello@studio.com' },
      { label: 'Phone', value: '+44 20 7946 0500', href: 'tel:+442079460500' },
      { label: 'Studio', value: '12 Print Works Lane, Manchester M19' },
    ],
  },
};

export const WithAside: Story = {
  name: 'A · With aside',
  args: {
    ...A_Split.args,
    aside: 'Open Monday–Thursday, 10am–8pm. Out-of-hours sessions by arrangement.',
  },
};

export const CustomForm: Story = {
  name: 'A · Custom form slot',
  args: {
    eyebrow: 'Contact',
    heading: 'Book a call instead',
    lede: 'No forms today — pick a slot that suits you.',
    form: (
      <div className="rdz-card col sx-contact__form">
        <strong>Prefer to talk?</strong>
        <span className="muted sx-fs-body-s">Grab 15 minutes with the team — no prep needed.</span>
        <Button href="#book">Pick a slot</Button>
      </div>
    ),
  },
};
