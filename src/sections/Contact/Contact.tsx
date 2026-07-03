'use client';
import type { FormEvent, ReactNode } from 'react';
import { SectionShell, SectionHeader, type SectionBaseProps } from '../../lib/SectionShell';
import { Field } from '../../components/inputs/Field';
import { Input } from '../../components/inputs/Input';
import { Textarea } from '../../components/inputs/Textarea';
import { Button } from '../../components/actions/Button';

/** One labelled contact detail (email, phone, address…). */
export interface ContactDetail {
  /** Short label above the value — rendered in the mono eyebrow style. */
  label: ReactNode;
  /** The detail itself. */
  value: ReactNode;
  /** Link target — the value renders as an `<a>` (mailto:, tel:, maps…). */
  href?: string;
}

/** The typed values the default form submits. */
export interface ContactValues {
  name: string;
  email: string;
  message: string;
}

export interface ContactProps extends SectionBaseProps {
  eyebrow?: ReactNode;
  heading?: ReactNode;
  /** Header alignment. Defaults to 'start' so the heading shares the intro
   *  column's left edge beside the form. @default 'start' */
  align?: 'start' | 'center';
  /** Intro paragraph under the header. */
  lede?: ReactNode;
  /** Labelled contact details (email, phone, address…) under the lede. */
  details?: ContactDetail[];
  /** Extra node pinned under the details (e.g. opening hours, a map embed). */
  aside?: ReactNode;
  /** Submit button label on the default form. @default "Send message" */
  submitLabel?: string;
  /** Receives the typed values on submit. The default is prevented and the
   *  values are read from `FormData` — the inputs stay uncontrolled. */
  onSubmit?: (values: ContactValues) => void;
  /** Replaces the default name/email/message form entirely. */
  form?: ReactNode;
}

/**
 * Contact A — split contact section: intro column (header, lede, labelled
 * details, optional aside) beside a message form. The default form is
 * uncontrolled name/email/message (name + email required) with a submit
 * button; pass `form` to swap in your own, or `children` to replace the
 * whole body.
 */
export function ContactA({
  eyebrow,
  heading,
  align = 'start',
  lede,
  details,
  aside,
  submitLabel = 'Send message',
  onSubmit,
  form,
  children,
  ...props
}: ContactProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onSubmit) return;
    const data = new FormData(event.currentTarget);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
  };
  return (
    <SectionShell wrap="sx-contact" {...props}>
      {children ?? (
        <>
          <div className="col sx-contact__intro">
            <SectionHeader eyebrow={eyebrow} heading={heading} align={align} />
            {lede && <p className="lede sx-contact__lede">{lede}</p>}
            {details && details.length > 0 && (
              <ul className="sx-contact__details">
                {details.map((detail, i) => (
                  <li key={i} className="col sx-contact__detail">
                    <span className="eyebrow2">{detail.label}</span>
                    {detail.href ? (
                      <a className="sx-contact__detail-value" href={detail.href}>{detail.value}</a>
                    ) : (
                      <span className="sx-contact__detail-value">{detail.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {aside && <div className="sx-contact__aside">{aside}</div>}
          </div>
          {form ?? (
            <form className="col sx-contact__form" onSubmit={handleSubmit}>
              <Field label="Name" required>
                <Input name="name" autoComplete="name" />
              </Field>
              <Field label="Email" required>
                <Input type="email" name="email" autoComplete="email" />
              </Field>
              <Field label="Message">
                <Textarea name="message" rows={5} />
              </Field>
              <Button type="submit" className="sx-contact__submit">{submitLabel}</Button>
            </form>
          )}
        </>
      )}
    </SectionShell>
  );
}
