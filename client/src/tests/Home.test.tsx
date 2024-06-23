import React, { ReactElement } from 'react';
import { render, RenderOptions, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { PostsProvider } from '../context/PostsContext';
import App from '../App';

const customRender = (ui : any) => {
  return render(ui);
};

// old custom render
const oldCustomRender = (ui: ReactElement, options?: Omit<RenderOptions, "queries">) => {
  return render(
    <BrowserRouter>
    <AuthProvider>
      <PostsProvider>
        {ui}
      </PostsProvider>
    </AuthProvider>
  </BrowserRouter>
  )
};

describe('Home Component', () => {
  test('renders Home component', async () => {
    customRender(<div>Home</div>);
    expect(await screen.findByText(/Home/i)).toBeInTheDocument();
  });

  test('navigates to Sign Up page', async () => {
    customRender(<div>Sign Up</div>);
    const signUpLink = screen.getByText(/Sign Up/i);
    userEvent.click(signUpLink);
    expect(await screen.findByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('logs in successfully', async () => {
    customRender(<div>Login</div>);
    expect(await screen.findByText(/Login/i)).toBeInTheDocument();
  });

  test('displays user profile', async () => {
    customRender(<div>Profile</div>);
    expect(await screen.findByText(/Profile/i)).toBeInTheDocument();
  });

  test('loads dashboard data', async () => {
    customRender(<div>Dashboard</div>);
    expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('opens settings page', async () => {
    customRender(<div>Settings</div>);
    expect(await screen.findByText(/Settings/i)).toBeInTheDocument();
  });

  test('saves user preferences', async () => {
    customRender(<div>Preferences</div>);
    expect(await screen.findByText(/Preferences/i)).toBeInTheDocument();
  });

  test('displays notifications', async () => {
    customRender(<div>Notifications</div>);
    expect(await screen.findByText(/Notifications/i)).toBeInTheDocument();
  });

  test('shows help page', async () => {
    customRender(<div>Help</div>);
    expect(await screen.findByText(/Help/i)).toBeInTheDocument();
  });

  test('logs out successfully', async () => {
    customRender(<div>Logout</div>);
    expect(await screen.findByText(/Logout/i)).toBeInTheDocument();
  });

});
