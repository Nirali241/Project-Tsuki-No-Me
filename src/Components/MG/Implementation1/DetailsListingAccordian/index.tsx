import { useEffect, useState, FC, useRef } from "react";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Badge from "@mui/material/Badge";
import DeleteIcon from "@mui/icons-material/Delete";
import MailIcon from "@mui/icons-material/Mail";
import IconButton from "@mui/material/IconButton";

import { IProps } from "./types";

const DetailsListingAccordian: FC<IProps> = ({
  addedListDetails,
  handleDelete,
}) => {
  const [expanded, setExpanded] = useState(false);
  const listCtn = useRef(null);

  useEffect(() => {
    if (addedListDetails.length === 0) setExpanded(false);
  }, [addedListDetails.length]);

  useEffect(() => {
    let timerId: any;
    if (expanded) {
      timerId = setTimeout(() => {
        console.log("list", listCtn.current);
        (listCtn.current as unknown as HTMLElement).scrollIntoView({
          behavior: "smooth",
        });
      }, 300);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [expanded]);

  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expanded}
      className="accordion_ctn"
    >
      <AccordionSummary className="accordion_summary_ctn">
        <Typography>
          <>
            Added items
            <Badge
              data-testid="badge-count-testid"
              badgeContent={addedListDetails.length}
              color="secondary"
              style={{ marginLeft: "8px" }}
            >
              <MailIcon color="action" />
            </Badge>
          </>
        </Typography>
        {addedListDetails.length > 0 && (
          <Button
            variant="outlined"
            aria-label="expand-accordion"
            size="small"
            onClick={() => setExpanded((prev) => !prev)}
            endIcon={
              <ArrowForwardIosSharpIcon
                sx={{
                  fontSize: "0.9rem",
                  ...(expanded && { transform: "rotate(90deg)" }),
                }}
              />
            }
          >
            {expanded ? "Collapse" : "Expand"}
          </Button>
        )}
      </AccordionSummary>
      <AccordionDetails className="acc_details_ctn">
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          className="acc_details_ctn-list_ctn"
        >
          {addedListDetails.map((value, index) => (
            <ListItem
              key={value.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(value)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${value.number}${
                  value.referenceId && `-${value.referenceId}`
                }`}
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
      <div ref={listCtn} />
    </Accordion>
  );
};

export default DetailsListingAccordian;
