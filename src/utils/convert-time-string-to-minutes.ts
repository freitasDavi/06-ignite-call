export function convertTimeStringToMinutes(timeString: string) {
  const [horas, minutos] = timeString.split(':').map(Number)

  return horas * 60 + minutos
}
