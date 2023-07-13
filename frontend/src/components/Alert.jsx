import { Alert } from 'flowbite-react';

export default function Alerts(props) {
  return (
    <Alert className={`${props.hidden} fixed bottom-0 w-full z-50`} color={props.color}>
      <span>
        <p>
          <span className="font-medium">
            <b>{props.title + ": "}</b>
          </span>
          {props.description}
        </p>
      </span>
    </Alert>
  )
}


