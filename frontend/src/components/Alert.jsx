import { Alert } from 'flowbite-react';

export default function Alerts(props) {
  return (
    <Alert className={`${props.hidden} fixed bottom-0 w-full`} color={props.color}>
      <span>
        <p>
          <span className="font-medium">
            {props.title} 
          </span>
          {props.description}
        </p>
      </span>
    </Alert>
  )
}


