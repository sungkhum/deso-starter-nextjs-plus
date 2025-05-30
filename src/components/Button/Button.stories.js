import { fn } from '@storybook/test';
import { Button } from './Button';
import { Home } from '@/assets/icons'; // example icon
// import { HomeIcon as Home } from 'lucide-react'; // Alternative if you want to switch to lucide

const themeDecorator = (theme) => (Story) => (
  <div data-theme={theme} style={{ padding: '1rem', background: theme === 'light' ? '#fff' : '#202020' /* Adjusted dark bg for better contrast with ShadCN dark buttons */ }}>
    <Story />
  </div>
);

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onClick: fn(),
    children: 'Button Text', // Default button text for new stories
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    isLoading: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    // icon prop can be further enhanced if needed, e.g. by providing a list of selectable icons
  },
};

// === DEFAULT (formerly PRIMARY) ===
export const DefaultDark = {
  name: 'Default (Dark Theme)',
  args: {
    variant: 'default',
    size: 'default',
    children: 'Default Button',
  },
  decorators: [themeDecorator('dark')],
};

export const DefaultLight = {
  name: 'Default (Light Theme)',
  args: {
    variant: 'default',
    size: 'default',
    children: 'Default Button',
  },
  decorators: [themeDecorator('light')],
};

// === OUTLINE (formerly SECONDARY) ===
export const OutlineDark = {
  name: 'Outline (Dark Theme)',
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Outline Button',
  },
  decorators: [themeDecorator('dark')],
};

export const OutlineLight = {
  name: 'Outline (Light Theme)',
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Outline Button',
  },
  decorators: [themeDecorator('light')],
};

// === DESTRUCTIVE (formerly DANGER) ===
export const DestructiveDark = {
  name: 'Destructive (Dark Theme)',
  args: {
    variant: 'destructive',
    size: 'default',
    children: 'Destructive Button',
  },
  decorators: [themeDecorator('dark')],
};

export const DestructiveLight = {
  name: 'Destructive (Light Theme)',
  args: {
    variant: 'destructive',
    size: 'default',
    children: 'Destructive Button',
  },
  decorators: [themeDecorator('light')],
};

// === SECONDARY (ShadCN variant) ===
export const SecondaryDark = {
  name: 'Secondary (ShadCN) (Dark Theme)',
  args: {
    variant: 'secondary',
    size: 'default',
    children: 'Secondary Button',
  },
  decorators: [themeDecorator('dark')],
};

export const SecondaryLight = {
  name: 'Secondary (ShadCN) (Light Theme)',
  args: {
    variant: 'secondary',
    size: 'default',
    children: 'Secondary Button',
  },
  decorators: [themeDecorator('light')],
};

// === GHOST (ShadCN variant) ===
export const GhostDark = {
  name: 'Ghost (Dark Theme)',
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Ghost Button',
  },
  decorators: [themeDecorator('dark')],
};

export const GhostLight = {
  name: 'Ghost (Light Theme)',
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Ghost Button',
  },
  decorators: [themeDecorator('light')],
};

// === LINK (ShadCN variant) ===
export const LinkDark = {
  name: 'Link (Dark Theme)',
  args: {
    variant: 'link',
    size: 'default',
    children: 'Link Button',
  },
  decorators: [themeDecorator('dark')],
};

export const LinkLight = {
  name: 'Link (Light Theme)',
  args: {
    variant: 'link',
    size: 'default',
    children: 'Link Button',
  },
  decorators: [themeDecorator('light')],
};


// === WITH ICON ===
export const WithIconDark = {
  name: 'With Icon (Dark Theme)',
  args: {
    variant: 'default', // Changed from 'primary'
    size: 'default',    // Changed from 'medium'
    children: 'With Icon',
    icon: <Home />,
  },
  decorators: [themeDecorator('dark')],
};

export const WithIconLight = {
  name: 'With Icon (Light Theme)',
  args: {
    variant: 'default', // Changed from 'primary'
    size: 'default',    // Changed from 'medium'
    children: 'With Icon',
    icon: <Home />,
  },
  decorators: [themeDecorator('light')],
};

// === ICON ONLY (ShadCN size) ===
export const IconOnlyDark = {
  name: 'Icon Only (Dark Theme)',
  args: {
    variant: 'default',
    size: 'icon',
    children: <Home />, // Children is now the icon itself for icon buttons
    // icon: <Home />, // Prop 'icon' is not used when size is 'icon', children becomes the icon
  },
  decorators: [themeDecorator('dark')],
};

export const IconOnlyLight = {
  name: 'Icon Only (Light Theme)',
  args: {
    variant: 'default',
    size: 'icon',
    children: <Home />,
  },
  decorators: [themeDecorator('light')],
};


// === LOADING ===
export const LoadingDark = {
  name: 'Loading (Dark Theme)',
  args: {
    variant: 'default', // Changed from 'primary'
    size: 'default',    // Changed from 'medium'
    isLoading: true,
    children: 'Loading...', // Text might be hidden by loader in actual component
  },
  decorators: [themeDecorator('dark')],
};

export const LoadingLight = {
  name: 'Loading (Light Theme)',
  args: {
    variant: 'default', // Changed from 'primary'
    size: 'default',    // Changed from 'medium'
    isLoading: true,
    children: 'Loading...',
  },
  decorators: [themeDecorator('light')],
};

// === SIZES ===
export const SmallDark = {
  name: 'Small Size (Dark Theme)',
  args: {
    variant: 'default', // Changed from 'primary'
    size: 'sm',         // Changed from 'small'
    children: 'Small Button',
  },
  decorators: [themeDecorator('dark')],
};

export const SmallLight = {
  name: 'Small Size (Light Theme)',
  args: {
    variant: 'default', // Changed from 'primary'
    size: 'sm',         // Changed from 'small'
    children: 'Small Button',
  },
  decorators: [themeDecorator('light')],
};

export const LargeDark = {
  name: 'Large Size (Dark Theme)',
  args: {
    variant: 'default', // Changed from 'primary'
    size: 'lg',         // Changed from 'large'
    children: 'Large Button',
  },
  decorators: [themeDecorator('dark')],
};

export const LargeLight = {
  name: 'Large Size (Light Theme)',
  args: {
    variant: 'default', // Changed from 'primary'
    size: 'lg',         // Changed from 'large'
    children: 'Large Button',
  },
  decorators: [themeDecorator('light')],
};
