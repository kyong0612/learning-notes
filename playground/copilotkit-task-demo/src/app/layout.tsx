import './globals.css';
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export const metadata = {
  title: 'AIタスク管理アプリ',
  description: 'CopilotKitを使ったAIタスク管理アプリ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <CopilotKit 
          publicApiKey={process.env.NEXT_PUBLIC_COPILOT_API_KEY || "YOUR_API_KEY_HERE"}
          // runtimeUrl="https://cloud.copilotkit.ai/runtime"
        >
          {children}
          <CopilotPopup
            defaultOpen={false}
            poweredByText="Powered by CopilotKit"
            tooltip="タスク管理AIアシスタント"
            placeholder="タスクについて質問したり、新しいタスクを追加したりできます..."
          />
        </CopilotKit>
      </body>
    </html>
  );
}
