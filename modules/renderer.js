import { one_action_link, two_action_link, three_action_link, reaction_link, free_link} from "../modules/provider.js";
import { renderFront } from "../modules/frontRenderer.js";
import { renderBack } from "../modules/backRenderer.js";

function render(cardType, information) {
    let front = renderFront(cardType, information);

    if (information.backText != null) {
        let back = renderBack(cardType, information);
        return [front, back];
    }

    return [front];
}

export { render };