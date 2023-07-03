/* eslint-disable camelcase */
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { year, month } = req.query

  // http://localhost:3333/api/users/freitas-davi/availability?date=2023-04-06

  if (!year || !month) {
    return res.status(400).json({ message: 'Year or Month not specified.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist' })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.week_day === weekDay,
    )
  })

  const yearMonth = `${year}-${String(month).padStart(2, '0')}`;

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    SELECT 
      EXTRACT(DAY FROM s.date) AS date,
      COUNT(s.date) AS amount,
      ((uti.time_end_in_minutes - uti.time_start_in_minutes) / 60) AS size
    FROM schedulings s

    LEFT JOIN user_time_intervals uti
    ON uti.week_day = WEEKDAY(DATE_ADD(s.date, INTERVAL 1 DAY))

    WHERE s.user_id = ${user.id}
      AND DATE_FORMAT(s.date, "%Y-%m") = ${yearMonth}

    GROUP BY EXTRACT(DAY FROM s.date),
    ((uti.time_end_in_minutes - uti.time_start_in_minutes) / 60)

    HAVING amount >= size
  `;

  const blockedDates = blockedDatesRaw.map((item) => item.date)

  return res.json({ blockedWeekDays, blockedDates })
}
