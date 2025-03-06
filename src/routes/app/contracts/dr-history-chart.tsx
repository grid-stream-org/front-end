import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const DemandResponseHistory = ({ events }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Contract Demand Response Events</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Event Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Utility</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event, index) => (
              <TableRow key={index}>
                <TableCell>{event.startDate}</TableCell>
                <TableCell>{event.endDate}</TableCell>
                <TableCell>{event.utilityId}</TableCell>
                <TableCell>{event.fulfilled ? 'Fulfilled' : 'Not Fulfilled'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default DemandResponseHistory
