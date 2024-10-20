import { MockProvider } from '@acme/acme.testing.mock-provider';
import { MyProjectReactWeb } from "./my-project-react-web.js";
    
export const MyProjectReactWebBasic = () => {
  return (
    <MockProvider noTheme>
      <MyProjectReactWeb />
    </MockProvider>
  );
}
