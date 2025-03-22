import renderer from "react-test-renderer";
import { render } from "@testing-library/react-native";
import App from './App.js';

describe("<App />", () => {
   

    it("renders correctly", () => {
        const tree = renderer.create(<App />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    
});