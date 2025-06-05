
import json
from datetime import datetime

# Load style config and FUKO rules (minimal dummy versions for now)
with open('engine/fuko_lang.json', 'r') as f:
    fuko_rules = json.load(f)

def evaluate_input(user_input, style='@ceo'):
    response = {
        'timestamp': datetime.utcnow().isoformat(),
        'input': user_input,
        'style': style,
        'decision': '',
        'justification': '',
        'emotion_score': 0.0,
        'style_trace': []
    }

    # Dummy logic: respond based on keyword
    if 'strategy' in user_input.lower():
        response['decision'] = 'Propose strategic pivot'
        response['justification'] = 'Detected keyword: strategy'
        response['emotion_score'] = 0.8
        response['style_trace'] = ['analytical', 'forward-looking']
    elif 'problem' in user_input.lower():
        response['decision'] = 'Initiate diagnostic routine'
        response['justification'] = 'Problem detected'
        response['emotion_score'] = 0.6
        response['style_trace'] = ['supportive', 'structured']
    else:
        response['decision'] = 'Acknowledge input and request clarification'
        response['justification'] = 'No actionable keyword found'
        response['emotion_score'] = 0.5
        response['style_trace'] = ['neutral']

    return response

if __name__ == '__main__':
    user_input = input("User: ")
    decision_output = evaluate_input(user_input)
    print(json.dumps(decision_output, indent=2))
