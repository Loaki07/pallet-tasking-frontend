import React from "react";
import { Badge, Card, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import * as constants from "./constants";

const TaskCard = ({ data, showFormModal }) => {
    const history = useHistory();
    const {
        task_id,
        client,
        worker_id,
        task_deadline,
        cost,
        status,
        task_description,
    } = data;

    const attributesForCard =
        status === "Completed"
            ? {
                  badgeColor: "green",
                  button: <></>,
              }
            : status === "InProgress"
            ? {
                  badgeColor: "yellow",
                  button: [
                      <Button
                          key={0}
                          variant="primary"
                          name={constants.FORM_TYPES.COMPLETE_TASK.type}
                          onClick={(e) => showFormModal(e, data)}
                      >
                          Complete
                      </Button>,
                      <Button
                          key={1}
                          variant="success"
                          name={constants.FORM_TYPES.APPROVE_TASK.type}
                          onClick={(e) => showFormModal(e, data)}
                      >
                          Approve
                      </Button>,
                  ],
              }
            : status === "PendingApproval"
            ? {
                  badgeColor: "red",
                  button: (
                      <Button
                          variant="success"
                          name={constants.FORM_TYPES.APPROVE_TASK.type}
                          onClick={(e) => showFormModal(e, data)}
                      >
                          Approve
                      </Button>
                  ),
              }
            : {
                  badgeColor: "blue",
                  button: (
                      <Button
                          variant="warning"
                          name={constants.FORM_TYPES.BID_FOR_TASK.type}
                          onClick={(e) => showFormModal(e, data)}
                      >
                          Bid
                      </Button>
                  ),
              };

    return (
        <Card
            className="task-card  p-4"
            // onClick={() => history.push(`/task/${task.task_id}`)}
        >
            <Card.Body>
                <Card.Text>
                    {_.capitalize(task_description)}
                    <Badge
                        variant={attributesForCard.badgeColor}
                        className={`px-2 mx-2`}
                        style={{
                            display: "inline",
                            color: `${
                                attributesForCard.badgeColor === "yellow"
                                    ? "black"
                                    : "white"
                            }`,
                            backgroundColor: `${attributesForCard.badgeColor}`,
                            borderRadius: "10px",
                        }}
                    >
                        {status}
                    </Badge>
                </Card.Text>
                <Card.Text>Client: {client}</Card.Text>
                <Card.Text>TaskDeadline: {task_deadline}</Card.Text>
                <Card.Text>TaskCost: {cost}</Card.Text>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between align-items-center">
                {attributesForCard.button}
            </Card.Footer>
        </Card>
    );
};

export default TaskCard;
