// import { useEffect } from 'react'

// import { useAuth } from '@/context'
// import { fetchEvents } from '@/hooks/fetch-events'

// const CalendarCard = () => {
//   //const [events, setEvents] = useState<DREvent[]>([])
//   //const [loading, setLoading] = useState(true)
//   const { user } = useAuth()

//   // useEffect(() => {
//   //   const loadEvents = async () => {
//   //     if (!user) return
//   //     try {
//   //       /.const data = await fetchEvents(user)
//   //      // setEvents(data)
//   //     } catch (error) {
//   //       console.error('Failed to load events:', error)
//   //     } finally {
//   //      // setLoading(false)
//   //     }
//   //   }

//   //   loadEvents()
//   // }, [user])

//   // Convert event start times to a Set of date strings for quick lookup
//   // const eventDates = useMemo(() => {
//   //   return new Set(
//   //     events
//   //       .map(event => event.start_time && new Date(event.start_time).toDateString())
//   //       .filter(Boolean),
//   //   )
//   // }, [events])

//   return (
//     // <Card className="h-full flex flex-col justify-center items-center text-center p-6 rounded-xl">
//     //   <CardHeader>
//     //     <CardTitle>Demand Response Calendar</CardTitle>
//     //   </CardHeader>
//     //   <CardContent className="flex flex-col items-center">
//     //     {loading ? (
//     //       <p className="animate-pulse">Loading events...</p>
//     //     ) : (
//     //       <>
//     //         <p className="text-muted-foreground mb-2">
//     //           Highlighted dates indicate scheduled Demand Response events.
//     //         </p>
//     //         <div className="relative">
//     //           <Calendar
//     //             mode="single"
//     //             className="border-0"
//     //             modifiers={{
//     //               event: date => eventDates.has(date.toDateString()),
//     //             }}
//     //             modifiersClassNames={{
//     //               event: 'bg-primary text-white rounded-md hover:bg-primary-dark',
//     //             }}
//     //             components={{
//     //               Head: () => null, // Removes the default header
//     //               Caption: ({ displayMonth, onPreviousClick, onNextClick }) => (
//     //                 <div className="flex justify-center mt-2">
//     //                   <button
//     //                     onClick={onPreviousClick}
//     //                     className="px-3 py-1 bg-gray-200 rounded-md mx-2"
//     //                   >
//     //                     &lt;
//     //                   </button>
//     //                   <span className="text-lg font-semibold">
//     //                     {displayMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
//     //                   </span>
//     //                   <button
//     //                     onClick={onNextClick}
//     //                     className="px-3 py-1 bg-gray-200 rounded-md mx-2"
//     //                   >
//     //                     &gt;
//     //                   </button>
//     //                 </div>
//     //               ),
//     //             }}
//     //           />
//     //         </div>
//     //       </>
//     //     )}ya
//     //   </CardContent>
//     // </Card>
//     <div></div>
//   )
// }

// export default CalendarCard
