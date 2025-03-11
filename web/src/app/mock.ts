import {
  TimelineAction,
  TimelineEffect,
  TimelineRow,
} from "@xzdarcy/react-timeline-editor";

export const scaleWidth = 50;
export const scale = 5;
export const startLeft = 20;

export interface CustomTimelineAction extends TimelineAction {
  data: {
    src: string;
    name: string;
  };
}

export interface CusTomTimelineRow extends TimelineRow {
  actions: CustomTimelineAction[];
}

export const mockData: CusTomTimelineRow[] = [
  {
    id: "0",
    actions: [
      {
        id: "action0",
        start: 9.5,
        end: 16,
        effectId: "effect1",
        data: {
          src: "",
          name: "Label 0",
        },
      },
    ],
  },
  {
    id: "1",
    actions: [
      {
        id: "action1",
        start: 5,
        end: 9.5,
        effectId: "effect1",
        data: {
          src: "",
          name: "Label 1",
        },
      },
    ],
  },
  {
    id: "2",
    actions: [
      {
        id: "action2",
        start: 0,
        end: 5,
        effectId: "effect1",
        data: {
          src: "",
          name: "Label 2",
        },
      },
    ],
  },
  {
    id: "3",
    actions: [
      {
        id: "action3",
        start: 0,
        end: 20,
        effectId: "effect0",
        data: {
          src: "",
          name: "Label 3",
        },
      },
    ],
  },
];
