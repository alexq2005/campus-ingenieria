import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('<Counter />', () => {
  it('muestra el valor inicial', () => {
    render(<Counter initial={5} />);
    expect(screen.getByText(/Contador:/)).toHaveTextContent('Contador: 5');
  });

  it('incrementa al click en +1', async () => {
    const user = userEvent.setup();
    render(<Counter initial={0} />);
    await user.click(screen.getByLabelText('Aumentar'));
    expect(screen.getByText(/Contador:/)).toHaveTextContent('Contador: 1');
  });

  it('usa el step personalizado', async () => {
    const user = userEvent.setup();
    render(<Counter initial={0} step={5} />);
    await user.click(screen.getByLabelText('Aumentar'));
    await user.click(screen.getByLabelText('Aumentar'));
    expect(screen.getByText(/Contador:/)).toHaveTextContent('Contador: 10');
  });

  it('resetea al click en reset', async () => {
    const user = userEvent.setup();
    render(<Counter initial={10} />);
    await user.click(screen.getByLabelText('Aumentar'));
    await user.click(screen.getByLabelText('Reset'));
    expect(screen.getByText(/Contador:/)).toHaveTextContent('Contador: 10');
  });
});
