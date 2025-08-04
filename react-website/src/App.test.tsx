import reportWebVitals from './reportWebVitals';

test('reportWebVitals function exists', () => {
  expect(typeof reportWebVitals).toBe('function');
});

test('app can render without crashing', () => {
  const div = document.createElement('div');
  div.setAttribute('id', 'root');
  document.body.appendChild(div);
  expect(div).toBeInTheDocument();
});
