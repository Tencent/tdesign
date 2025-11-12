import { html, define } from 'hybrids';
import { createAISearchSDK } from './utils';
import style from './style.less?inline';

export default define({
  tag: 'td-ai-button',
  framework: '',
  demoRequestBody: '',
  render: ({ framework, demoRequestBody }) => {
    return html`
      <button class="TDesign-ai-button" onclick="${() => createAISearchSDK(framework, demoRequestBody)}">
        <span>
          <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.34644 0.0014782L10.6731 5.32692L15.9985 7.65358L10.6731 9.98025L8.34644 15.3057L6.01977 9.98025L0.694336 7.65358L6.01977 5.32692L8.34644 0.0014782ZM14.55 2.21647L13.5041 2.73707L14.55 3.25768L15.0706 4.30356L15.5912 3.25768L16.637 2.73707L15.5912 2.21647L15.0706 1.17059L14.55 2.21647ZM13.2237 9.83728L14.0899 11.5774L15.8301 12.4436L14.0899 13.3098L13.2237 15.05L12.3575 13.3098L10.6174 12.4436L12.3575 11.5774L13.2237 9.83728Z"
              fill="url(#paint0_linear_465_5938)"
              style=""
            />
            <defs>
              <linearGradient
                id="paint0_linear_465_5938"
                x1="-0.102799"
                y1="0.236928"
                x2="14.5949"
                y2="17.087"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  stop-color="#0062FF"
                  style="stop-color:#0062FF;stop-color:color(display-p3 0.0000 0.3843 1.0000);stop-opacity:1;"
                />
                <stop
                  offset="1"
                  stop-color="#00C3FF"
                  style="stop-color:#00C3FF;stop-color:color(display-p3 0.0000 0.7647 1.0000);stop-opacity:1;"
                />
              </linearGradient>
            </defs>
          </svg>
          <span class="TDesign-ai-button__text" data-text="AI 搜索"> AI 搜索 </span>
        </span>
      </button>
    `.css`${style}`;
  },
});
