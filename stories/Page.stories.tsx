import { ComponentMeta, ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { Page } from './Page';

const defaultTemplate: ComponentMeta<typeof Page> = {
  title: 'Example/Page',
  component: Page,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  }
};

export default defaultTemplate;

const Template: ComponentStory<typeof Page> = ( args ) => <Page {...args} />;

export const LoggedOut: ComponentStory<typeof Page> = Template.bind( {} );

export const LoggedIn: ComponentStory<typeof Page> = Template.bind( {} );

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
LoggedIn.play = async ( { canvasElement } ) => {
  const canvas = within( canvasElement );
  const loginButton = await canvas.getByRole( 'button', { name: /Log in/iu } );
  await userEvent.click( loginButton );
};
