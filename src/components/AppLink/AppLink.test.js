import React from 'react';
import { render, screen } from '@testing-library/react';
import AppLink from './AppLink';
import { AppRouter } from '../../routes';

describe('AppLink component', () => {
  //   beforeEach(() => {});

  it('renders itself', async () => {
    const text = 'sample text';
    const url = 'https://example.com/';
    await render(
      <AppRouter>
        <AppLink href={url}>{text}</AppLink>
      </AppRouter>
    );
    const link = await screen.getByText(text);
    expect(link).toBeDefined();
    expect(link).toHaveAttribute('href', url);
    expect(link).toHaveTextContent(text);
  });

  it('supports external link', async () => {
    const text = 'external link';
    const url = 'https://example.com/';
    await render(
      <AppRouter>
        <AppLink href={url}>{text}</AppLink>
      </AppRouter>
    );
    const link = await screen.getByText(text);
    expect(link).toBeDefined();
    expect(link).toHaveAttribute('href', url);
    expect(link).toHaveTextContent(text);
    expect(link).toHaveAttribute('target', '_blank'); // Open external links in new Tab by default
    expect(link).toHaveAttribute('rel'); // For links opened in new Tab rel="noreferrer noopener" is required
    const rel = link?.rel;
    expect(rel.includes('noreferrer')).toBeTruthy(); // ref="noreferrer" check
    expect(rel.includes('noopener')).toBeTruthy(); // rel="noreferrer check
  });

  it('supports internal link', async () => {
    const text = 'internal link';
    const url = '/internal-link';
    await render(
      <AppRouter>
        <AppLink to={url}>{text}</AppLink>
      </AppRouter>
    );
    const link = await screen.getByText(text);
    expect(link).toBeDefined();
    expect(link).toHaveAttribute('href', url);
    expect(link).toHaveTextContent(text);
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('supports openInNewTab property', async () => {
    // External link with openInNewTab={false}
    let text = 'external link in same tab';
    let url = 'https://example.com/';
    await render(
      <AppRouter>
        <AppLink href={url} openInNewTab={false}>
          {text}
        </AppLink>
      </AppRouter>
    );
    let link = await screen.getByText(text);
    expect(link).toBeDefined();
    expect(link).toHaveAttribute('href', url);
    expect(link).toHaveTextContent(text);
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');

    // Internal link with openInNewTab={true}
    text = 'internal link in new tab';
    url = '/internal-link-in-new-tab';
    await render(
      <AppRouter>
        <AppLink to={url} openInNewTab>
          {text}
        </AppLink>
      </AppRouter>
    );
    link = await screen.getByText(text);
    expect(link).toBeDefined();
    expect(link).toHaveAttribute('href', url);
    expect(link).toHaveTextContent(text);
    expect(link).toHaveAttribute('target', '_blank'); // Open links in new Tab
    expect(link).toHaveAttribute('rel'); // For links opened in new Tab rel="noreferrer noopener" is required
    const rel = link?.rel;
    expect(rel.includes('noreferrer')).toBeTruthy(); // ref="noreferrer" check
    expect(rel.includes('noopener')).toBeTruthy(); // rel="noreferrer check
  });

  it('supports className property', async () => {
    let text = 'internal link with specific class';
    let url = '/internal-link-with-class';
    let className = 'someClassName';
    await render(
      <AppRouter>
        <AppLink to={url} className={className}>
          {text}
        </AppLink>
      </AppRouter>
    );
    let link = await screen.getByText(text);
    expect(link).toBeDefined();
    expect(link).toHaveClass(className);
  });
});
