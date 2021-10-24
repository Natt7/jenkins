import {trigger, state, animate, transition, style, group, query} from '@angular/animations';

export function slideInOutAnimation() {
  return trigger('slideInOutAnimation', [

    // end state styles for route container (host)
    state('*', style({
      // the view covers the whole screen with a semi tranparent background
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)'
    })),

    // route 'enter' transition
    transition(':enter', [

      // styles at start of transition
      style({
        // start with the content positioned off the left of the screen,
        // -400% is required instead of -100% because the negative position adds to the width of the element
        left: '-400%',

        // start with background opacity set to 0 (invisible)
        backgroundColor: 'rgba(255, 255, 255, 0)'
      }),

      // animation and styles at end of transition
      animate('.5s ease-in-out', style({
        // transition the left position to 0 which slides the content into view
        left: 0,

        // transition the background opacity to 0.8 to fade it in
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
      }))
    ]),

    // route 'leave' transition
    transition(':leave', [
      // animation and styles at end of transition
      animate('.5s ease-in-out', style({
        // transition the left position to -400% which slides the content out of view
        left: '-400%',

        // transition the background opacity to 0 to fade it out
        backgroundColor: 'rgba(255, 255, 255, 0)'
      }))
    ])
  ]);
}


export function sliderAnimation() {
  trigger('sliderAnimation', [
    transition(':increment', group([
      query(':enter', [
        style({
          left: '100%'
        }),
        animate('0.5s ease-out', style('*'))
      ]),
      query(':leave', [
        animate('0.5s ease-out', style({
          left: '-100%'
        }))
      ])
    ])),
    transition(':decrement', group([
      query(':enter', [
        style({
          left: '-100%'
        }),
        animate('0.5s ease-out', style('*'))
      ]),
      query(':leave', [
        animate('0.5s ease-out', style({
          left: '100%'
        }))
      ])
    ]))
  ])
}
