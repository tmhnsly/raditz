import { useState } from 'react';
import { GiMoonOrbit } from 'react-icons/gi';
import { Field } from '../../components/inputs/Field';
import { Input } from '../../components/inputs/Input';
import { Button } from '../../components/actions/Button';
import { Checkbox } from '../../components/inputs/Checkbox';

/**
 * Auth — a centred sign-in page: a brand mark, a card with email/password
 * fields, a primary submit, a social alternative, and a footer switch to
 * sign-up. A `mode` toggle relabels the same card for register. Built from the
 * form primitives (Field/Input/Button) and re-themes with tokens.
 */
export function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const signup = mode === 'signup';

  return (
    <div className="rdz-page auth">
      <main className="auth__card">
        <span className="auth__mark"><GiMoonOrbit /></span>
        <h1 className="auth__title">{signup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth__sub">{signup ? 'Start building with Raditz in minutes.' : 'Sign in to your Raditz workspace.'}</p>

        <form className="auth__form" onSubmit={(e) => e.preventDefault()}>
          {signup && (
            <Field label="Name">
              <Input name="name" autoComplete="name" placeholder="Ada Lovelace" />
            </Field>
          )}
          <Field label="Email">
            <Input type="email" name="email" autoComplete="email" placeholder="you@company.com" />
          </Field>
          <Field label="Password" hint={signup ? 'At least 8 characters.' : undefined}>
            <Input type="password" name="password" autoComplete={signup ? 'new-password' : 'current-password'} placeholder="••••••••" />
          </Field>

          <div className="auth__row">
            <Checkbox name="remember" label={signup ? 'Email me product updates' : 'Remember me'} />
            {!signup && <a className="auth__link" href="#">Forgot password?</a>}
          </div>

          <Button type="submit" variant="primary" className="auth__submit">
            {signup ? 'Create account' : 'Sign in'}
          </Button>
        </form>

        <div className="auth__or"><span>or</span></div>
        <Button variant="outline" className="auth__social">Continue with GitHub</Button>

        <p className="auth__switch">
          {signup ? 'Already have an account? ' : "Don't have an account? "}
          <button type="button" className="auth__link" onClick={() => setMode(signup ? 'signin' : 'signup')}>
            {signup ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </main>
    </div>
  );
}
