import { XPSettings, MilestoneTemplate } from './types';

export const READING_EMOJIS = {
  unprocessed: '📥',
  skimmed: '👀',
  completed: '✅',
};

export const TIER_LEVEL_RANGES = [
  { min: 1,  max: 5  },  // T1  Dormant
  { min: 6,  max: 10 },  // T2  Stirring
  { min: 11, max: 15 },  // T3  Kindling
  { min: 16, max: 20 },  // T4  Breaking
  { min: 21, max: 25 },  // T5  Wisp
  { min: 26, max: 30 },  // T6  Flicker
  { min: 31, max: 35 },  // T7  Blaze
  { min: 36, max: 40 },  // T8  Inferno
  { min: 41, max: 45 },  // T9  Drake
  { min: 46, max: 50 },  // T10 Wyrm
  { min: 51, max: 55 },  // T11 Dragon
  { min: 56, max: 60 },  // T12 Nova
];

export const MAX_ACTIVITIES_LOG = 500;

export const DEFAULT_MILESTONE_TEMPLATES: Record<string, MilestoneTemplate[]> = {
  manuscript: [
    { name: 'Outline drafted', xp: 50 },
    { name: 'Introduction written', xp: 80 },
    { name: 'Methods written', xp: 80 },
    { name: 'Results written', xp: 100 },
    { name: 'Discussion written', xp: 100 },
    { name: 'Full first draft complete', xp: 150 },
    { name: 'Revision round', xp: 100 },
    { name: 'Submitted', xp: 200 },
    { name: 'Accepted', xp: 300 },
  ],
  conference: [
    { name: 'Abstract submitted', xp: 50 },
    { name: 'Abstract accepted', xp: 30 },
    { name: 'Slides / poster prepared', xp: 100 },
    { name: 'Talk / poster delivered', xp: 150 },
  ],
  'invited-talk': [
    { name: 'Invitation accepted', xp: 30 },
    { name: 'Abstract / title submitted', xp: 30 },
    { name: 'Slides prepared', xp: 80 },
    { name: 'Talk delivered', xp: 150 },
  ],
  'peer-review': [
    { name: 'Review completed', xp: 100 },
    { name: 'Resubmission reviewed', xp: 60 },
  ],
  grant: [
    { name: 'Specific aims drafted', xp: 100 },
    { name: 'Background written', xp: 80 },
    { name: 'Methods written', xp: 100 },
    { name: 'Budget prepared', xp: 50 },
    { name: 'Submitted', xp: 200 },
    { name: 'Awarded', xp: 300 },
  ],
  report: [
    { name: 'Data / results compiled', xp: 50 },
    { name: 'First draft written', xp: 100 },
    { name: 'Revised draft', xp: 60 },
    { name: 'Submitted', xp: 100 },
  ],
  thesis: [
    { name: 'Chapter outline', xp: 50 },
    { name: 'First draft', xp: 150 },
    { name: 'Revised draft', xp: 100 },
    { name: 'Submitted to supervisor', xp: 80 },
    { name: 'Defended', xp: 300 },
  ],
  data: [
    { name: 'Protocol written', xp: 60 },
    { name: 'Ethics / permits approved', xp: 50 },
    { name: 'Data collection complete', xp: 100 },
    { name: "Data cleaned / QC'd", xp: 80 },
    { name: 'Dataset archived', xp: 50 },
  ],
  software: [
    { name: 'Requirements documented', xp: 50 },
    { name: 'First working prototype', xp: 100 },
    { name: 'Tests written', xp: 60 },
    { name: 'Documentation written', xp: 60 },
    { name: 'Released / published', xp: 150 },
  ],
  teaching: [
    { name: 'Course outline drafted', xp: 50 },
    { name: 'All lectures prepared', xp: 100 },
    { name: 'Course delivered', xp: 100 },
    { name: 'Student feedback reviewed', xp: 30 },
  ],
  workshop: [
    { name: 'Proposal / abstract submitted', xp: 50 },
    { name: 'Program finalised', xp: 80 },
    { name: 'Workshop delivered', xp: 150 },
  ],
  supervision: [
    { name: 'Initial meeting held', xp: 20 },
    { name: 'Research proposal reviewed', xp: 60 },
    { name: 'Progress meeting held', xp: 30 },
    { name: 'Thesis / report read', xp: 80 },
    { name: 'Defense / submission supported', xp: 100 },
  ],
  service: [
    { name: 'Role accepted', xp: 20 },
    { name: 'First contribution delivered', xp: 60 },
    { name: 'Term / cycle completed', xp: 80 },
  ],
  'research-program': [
    { name: 'Kickoff / inception report', xp: 50 },
    { name: 'Progress report 1 submitted', xp: 80 },
    { name: 'Progress report 2 submitted', xp: 80 },
    { name: 'Final report submitted', xp: 150 },
    { name: 'Program completed / renewed', xp: 200 },
  ],
  outreach: [
    { name: 'Concept / pitch prepared', xp: 40 },
    { name: 'Content created', xp: 80 },
    { name: 'Activity delivered / published', xp: 100 },
  ],
};

import { AchievementDef } from './types';

export const ACHIEVEMENTS: AchievementDef[] = [
  // First steps
  { id: 'first-xp',        name: 'First Steps',        icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABSElEQVR4nO3Uv0sDMRTA8e+ljXd2qOAiiNtRClXa2jo6+GPxH9BJtNBJxMXV2UFw1MVJcBHcugtOdRBBXIqDgos/FnURe941cSgUdbGpFhHzmUJ4vDzeSwKWZVmWISHRQqLb3f+KYxI8tzuuZY+DUiHXx49Uty8cgMKKr7NT/QDsz59Sf1Zt5xUmBVSWq4RODICwV5Av+Tpf8rXscwF4engxOhwMOwCAh84tpIi5ikYgiHglkUwAcLJZM8/3LV5nc3/PaATd8LcLEI1fLuAndHpr9cZ0Dldq4sSJiFg9PEeF5vmMOiAkulxI64PyJK7UFDNDAIyNptiaKbI4MtjFn9BDlzNphA4YHkgC0CPlh5CzqxvulKJSu287r0nLNB4sZf3WRjwKW+sgCNm5vGVtdoL1vaOuFNDkNT+ezy9AxYB6x3fKsqx/7A0ycFwwvGe7UwAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Earn your first XP',                      condition: { type: 'totalXP', xp: 1 } },
  { id: 'first-note',      name: 'First Idea',          icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADiUlEQVR4nO2WX2gcVRTGfzN3Zrdks3aJKFKzqaFRgy22iP+qEIxWUaQRTGOE+NDYF22Rqm0NpiDUP5UapHnri6VI0oqCKNj1RUUsFW0FFZPWJiq63dA2axOJJcnO7My9PsxmttNkM7srPpkP5uHcc+73fXPvnXsGlvB/h1bNJCdzQClbzRs3V22tmK/sCVb6oDJ1HUnOH5szYZg2rhZFKIvZuiZ0ZbEs3l4Wd1lF1tiAMpUDQPyWrThoDO17IVCzZlcf1o9vAZBruAHDzmHGnwzlDy2QmUMKYOb8GKnDJ2lpjnPN+nigRpcOUgpsyyXx0AB/n9gPK69DkA81oZcj7kyOkzp8kvbuFfPEfaLGNiLCYfarThL3vgjpC2HvFm7AtWfRclPU3vMK7d0r5uVV/cPeI22P7MYOANIDrV5BdhInc2D+aS3HwOUTj725oTCoAsJz0Bo7i6aMGoRSXHWXd0YW+lrKMjCHZbf1cntL0gsMLSAMIERhi3UH0h+hmwKAc0daw6jDDRimXQwc5a/AguLSgMaNANQ1rcLVvJw0otUbADDEwof4WOpTptK/+/Gp4+8HzSnli1vpgyX3wSiVEMoqBo5C112kFL54a9ujgfrVLe2B2NTMUtQBhK7AQrhSfA6amQdg5lwWZS6+9KEGtIbnNaXPcGl4N6eGRr1i3UWcPQrAzm397NzWD8DmLX1oZh7318/JX5zEjBhcu+kThG6Xoi/qLJaUY3sVQM3qPcx8+VQgp6TNS2+P0rdrDVIv7GTO6xPnj/9A/I6nidVH0CIaRvLZkjqLboFe36sBTA/3UNM6iJK2f+ns2PsT+3as9cV16fWKi9//TN2tm4klJ5CJ5YuKhxq40kTsgQ/8t+95LIltudzX/QW6dFDSZmLkFxLrOog0/YVc3hxGXZ4BAJF8VdO1HELqjI9kGR/J0tF/hvzEOKk9zWRP/8afZzLkhYu4qckXj17d9e+74eXInX5O9b4+RGfXgwCsW9uAtDSmJqYRyuT6+5/h0tlDZYtXbAAglogpXFkcEDqOq1CFM2BP2xVxVnwP3H1nM4OvbeHlrjbGvhnkwrfvsn/74+iGRua7DyulK30TlsLXJ4ZpqL0ZEGzveQ+AN3ZvZPSPHCvXb/rvDQAc+exjAH/Za2OyEIuKuar6K47Ga9QTGx4hitdjIia8kzpa8f5XbQAgEosEOlw14ktYAsA/0Y9Q/1k5uBAAAAAASUVORK5CYII=" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Create your first atomic note',           condition: { type: 'activityCount', activityType: 'atomic-note-created', count: 1 } },
  { id: 'first-paper',     name: 'First Read',          icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACWElEQVR4nO1WPWsUQRh+dnbmLglBQVFiRAvBCDZ+VCoiKqa+xlpIoZVlrLQVQf0LcmBtkBRWKYSAwdqvQuUOFYKeUSFwurszu2NxmZ2ZnZn7iHa5B47bmX2f933eZz5YYIwxdjoiz5zcJndbPCfJ8t1LAABKeq/2zuxxMrx/18G1B6vW3OM7V3Dk8G5QZqf8tv6jzFVjMeYXV6y6xCx+//pJUBKVhBDmju/Ho8WzmDtxqlf81gVvcbORGovLWBhumQIwkeuhKCRE4bpagPcVV42p5uDS5tMqWREat58DANaaDZxbWLZiXjav9mJF7hQ/s/CkfF5rNso8Kw/nvWIdAQrP7l0GABCwsiCl2iEWMS9PxSqECiuQ0AtRSKRpDkpJWViIAkIU3njf+gMAm5i2xt0ks3khAco6BbMzJSLNNF1wifM3lhzOxZtP+7oQFKCO477ZXSBgKMDLfxMHj57uJWKRd6nUUo4swIQqahZXuznPxUB+xt3NquDsgakD0wDn+hdAPdfFieAQXB+30D7xYaADYqsIjYcya2QRTtac+690MYTVgkvnNJgXESURktReDv8xzDLvdBWx4YrIilJEUKDnZg37OkhEEd5YJnLeExYzf6+jLey/gHPkiJ1pS1b2x+3qV+u7M/f5tZ772nrluCG4hOAS659cbvI7tcaOA5vtDdQNWZ12hE57oxIVYXKGgE5q+ovVjwCAekzAULOiDx2bcoQEBXxodcvnbKszmbhHKt9MAMwCAN5+6aJGpMGx74+fb3TOuF5tRWPYT6r/hf5fPWOMsWPwF3j77NpM+dRvAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete your first paper',               condition: { type: 'activityCount', activityType: 'paper-completed', count: 1 } },
  { id: 'first-milestone', name: 'Milestone Unlocked',  icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACZ0lEQVR4nO2WS2sTURSAv/tIJpNOaGJbXyCFloq/wSpaWhBcuxDc+QPcaXeCS5fuxD+hWHEjFsGVIi6FIm1pRAVb00fSRzJz73GR1lqtzUgbgpBvNQNnzvnmnjOHgS5d/gfu3b8rthTJw0cPRPXkhVwo5EJRPXkxUUE21pakrQK2FMn41ctSq31pFtsWaGwtSrK5LBu1yh6xHTnVk28pptMIXBo9z8vpN0jisNpjrMVYC4B3MVmjfsbWF2doVGZTv1wqgYtjFzAapl4/JTw+SLw6z+bSHMHAEOHJ4T/ijVZoZTA2aJnbpjX1SnHj+m20tkgcYzMZ8A4PBH2nqcy9AyB35hw6MVSXy2QTsGHpwLypTmAHcYJLkuY1CeKaLfbGQiIoseBMM9glNFzr2UwlYLVBi9CozNJYWiDbf5Zs7whufR63Vmbt0wem375CW7/nuXx0TP0l5W7uNAI7GK1QgcYr0AKu7jE6Jsgart28AzG4tTJJLAQDQ5ioIK5WPVAilcBW4vFKYfuG0SLUK2WSxBCcGEQLbH6bAWcQl+zOB6BM6/TpTiD+pd8ZCz4mayyY5hCG/cOsLrzHJ5rg1AgSK9aXy6i6JYwKRyCQ+S3MWxoIxNu3xuLqDmU0TjwoA/UjXI62FDU33D5MvXgmJirIytcZ+V7+KKqYF1UoyGatKrXllaPZhJOTt1Bm/1nKqhzPnzzGB0VssZ+V8mekWlVhVFBRqXi0X8F+XJmYaFnkIP5pEbWD1AJamc4JqEx7iqcWSMTgxXVOADrcAgB/qFk/pIAVg27TX19LAdtbEoDR8bH2GHTp0ml+AK6U92lzf2pCAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete your first project milestone',   condition: { type: 'activityCount', activityType: 'milestone-completed', count: 1 } },
  { id: 'writing-first',   name: 'First Draft',         icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABv0lEQVR4nO2Wz0sbQRzF38w6EpdY6L8gpQXFg1QpBNpL/wkPnoon/4sieOhNiRe9e/BcPIhEKKHZFNNIClXsIZeKlULcNRN/JLv7PITYS0t3JpvbfmAuyzDv8X1fHgtkZGSkjFAOje6nbcBv+TxrNuEwwsv5+f++L9M2cNZsAkAi8VQMCOWw4lUJAF9qdaPxp2LgNmgD6I9+8G166lniXRizFRbK4W3QRhj/0Zl+8RzoxQAA9qJEEVgZ2C8dsDD3CvWvDQDA4ecqEBKzMzOAkph8+sTmWXMqXpVrH9apdefxVMqe8R4YIV1BfdVmpexR6w7vu3ePZ7CMJlhFEDJC7biB2nEDy++WUG98AwAUXhdsnkuOdAWlK+i3fPotn7WjI2rdYbd7zcNPpdGOHgBUXvH3+S9urBdZLG71M/eqlK6wFjeqYukKXv64gJrI4eT7KcZz/QQX3iwgvqFVrRvtQHxDEehrBhc/MZ4bG0p4gFETDtotEs4wmvbsbW4PlfffSDwB6Qp+LO3AkdbtbW9A5RV3V9/jLrxHT/dS/YdIPIG9cgmdVpCmdnJWFt9S5dXoi+ZfjFI8UQRRHI5KPyMDD7TG0Ka/EyT0AAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Make your first writing progress',                              condition: { type: 'activityCount', activityType: 'writing-progress', count: 1 } },
  // Quantity — notes
  { id: 'notes-25',        name: 'Prolific',            icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEkklEQVR4nO2WS2yUVRTHf+d+0yJFpIRaCm2KYCuPWh9xoyEqK1cmrkzU+GqMGo2AISaaGIMKhkcQQUg0cYEbNya4EBN8g0QUV0ofM7UtUat0Z6DyCDrfOcfFnX6d6UwruIWbTGbud+85///5/8/c78KVcbkPuYS9Xj5JEBSXWmuXkvtiNjnA4cdei8AhhqzZtxEALWH3Pr03C/hbitz+7oaJ9Rkx/ouAH+3ZAkVj1ZI21A0LAYDvC3nu278NgL6e3Xh9QkfbQsxiyoHffkE9cOe+F2YkEaZbSBA/2rOFrrY2upa2x2rMmNvUhIpxx83d7LhnLQDtSxexrK0lAzdgeWs7K5cs5sjDm6G2RdMTCJL4kSe20t26hOAJbkZDcxPXtLSgpsyedw2pOaqxF7K4UIljHljVsYzvet6clkQtAm6u5DxgoqgXaWhuIrewkfqWRmYvXoCrkwuC6iT4R99+gWhKQ2czV3c2I3VxTXEkmcx9UQoce3Q7Kxe34mbMmd9IbmEjAGIas2ia7d20Zi3XbnyI+1ffVZFjbkcL85cvIkHoXNTCoZ6dtaAqCSSI//D4Lla1t2GSMOuqBpK2pth8piigbijGk/s+wAi8cngPp159H4BZN7RWJFdXRCNEV+sCPntkZ5UKVQrkTLCSZrmOFtStYt0szt976kGSEHAJmCnmlepq6XvOimZcwanDp+SqIuASp1rDGHVHSyCppajGf8XEmN3ZXgVeYb5H20LZswoCQRJ/6cZnONA7FEFIGe8brah6Ysy7/rpqgkTJtfyhK6cHxrJp/9ifbLt7A5TZUFFrfeKs7uzmeP4MrrGA8b5RQqiUxHUiPhJTC+WLUakycBXl5xMXuGVhW6ZiTQJYlEeY7HILwl/5URKpPMw8jXOp4WuCcXpgDBXFQ0oQJy0Bm1bur3I7iGFi9A+fQV1IJAaOF36v3FjSeqJvvIzgqcIoHtJS9Ub/SLGKZE0CYpMNYmJs//AQJJJ9zg7+wXjhJGcHT8b9KogbKYHz+V8ZHxwrk93woGzafxx3pUj09B+byQLgUH6Iohqf5/Pc23UbhYEL07LPkiQpaSnVROUAI0PKA90r+HS4AMCREyNMcWCSgLihU3xOcgmOkh84F1Wpc5JcbKqRoXPZvp8GiphPAqsYI4OOiWUWAaSmTDUjlwXh8kbfW/7iynV8MzhU9aIuFM7HHxZwNFJPo5yJCIVhoNS8wRwTR1QoBsNd+Wp4CAnG9mNvQ1n2HDWGuTPxCvckJvLMO4VQeieU/RNcAE8JLpFgmbvxHDGCV59wFU8Ul62DpZtNcA7m+2LyxJEgSJAM/OuhAmkaz4oDJwagZIGJ4xIQN4rB+LjQl+Xf8eOeiuqrCExUkzEX42B/PpIgxUsSf1kogJZ1cxE+GenLyBEUl5CBqws6zaWo5tME8ee7nmVWENwCiQRCWTMhEej13t0kCBu610NdXPJSmxfdSMRRF8yUPf3v1MSb6U7oJTK8fNO6WBiOIZgJm/t3ZfH1kvP1tz6HBMNKyhTV2d27tzxfTayLujoniGv1ZWZq7P++ml8Zl/f4FxnJNqk5c0BkAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Create 25 atomic notes',                                        condition: { type: 'activityCount', activityType: 'atomic-note-created', count: 25 } },
  { id: 'notes-100',       name: 'Zettelkasten',        icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACk0lEQVR4nO2X30uTURjHP+9c+t7EBkGiZOKvIck7pqITRIMKwSjJHxgpXVR/QVQk3kV/hkQQRBdpFpWkpEtfV7ihObWWlW06yvLKBebAbaeLaE6seH+gEfTAe3E453me7znf53ue88J/+1dNttnFuG9IjPuGhGyzC6NxrGZA1OZ7zLibs+iz08JRrQilxinEu07DJ2DR6/DzuK2ZCbIsEvKeDOLf4kbz6wcwoY5sGSulDsPJwUQN7Gt8Ss+FbGCavfVfdg/AkxEvgZkp4Vc9jAZeAXCtS6HEkSdaWtukHQcQCUe40n2dRDKO16sC4HavYFV15wbAkFfDiWZRUXYIt7uWT8sR5oLzLIRDDD3q1x1PdxGeajsjxtRN/efm5AEwpno4evykbjnqBnC/944EsLGR2DY3PPBw508AIBZdlWbfzgNQkLOfhXCIWHTVEJ2GAKRbaHnFlL/he2BM9bC2HqNcUUiviV0DANB0rMGMu3kALyZ9pgGYroG/BiAp4hQcyKXoYD4Ag4MDhlqyZukEZqaEu+4ISRHHIllJiq0t2CJtsqlHkpoXyja7iEVXJdlmF7Xlldvmv66tA+D3P9d1H2imIH1XTpeLj8ufU5/35ST1dfW6k4NBFRSXOAjfvJGiwSJZKSwqMBJKfxGeO3segI72zlTy1qYWMrKMtWNDKpgLzlPpcvIhGOH96xB1h2vwTQQMAdANW7bZRUd7J3337pKT/aMVWzMzqK6qwuf3Mzft0xVTlwq6Ll9kaenPzafS5eRS91XNUtREgWyzi5FhDw2NTSwsLv523eybIKVlxTx+0IfWvyXNKui5dZvSwnziie0PkXQbHB3XGhLQSEH6bhRnBW2tzb9c19vXz+zMVGqshYbvC/blvMD3S8EAAAAASUVORK5CYII=" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Create 100 atomic notes',                                       condition: { type: 'activityCount', activityType: 'atomic-note-created', count: 100 } },
  // Quantity — papers
  { id: 'papers-10',       name: 'Bookworm',            icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC0ElEQVR4nO2W3UuTYRTAf+/mXlxZ5sdmKqTNrNSJBpYSUhfVTSJ0ZUZ3XUQIBUWEf0Bh4EWXgRAIXtlNENJNEiFlVBd+5fzc3MxXnQ6/3dzevb5drL0ydHOz7ty5Oud5znnOj+ec5/BAUpKSlMMuwkEDe69fU8O6Qdw55uKH7oTOTInX8XRunnrpYRuD37/S9KOTEZsDUdUjGnQAGHUpiCm6RHIDEDXi8c0WtcH6SH3V9FotyC9SM288IaAonK+qoVXdpCQ7gwv5JsrMWbtA/wuAND0HwLeeEY6oRm29r/czankjI55l3k666JMWCcjb2v5TOaH80QF8/oCm36m8j1uaYHpiAiW4TZ7lHC6vH4AJn5ci03HNt+hEFqdO5sRNERVg0PtR039NT6If7WZh7jcAs44x2lMVbd+ztgVAIBi6ibY0U7z5owO4JLswtPRJsx/UNKOzdQFQWlZBSWNL3EkOBADgFXya3jc2RH6KBQDb8AAA7akKAZQ9Y+MtQ0wAl2QXpE0JgwFSDQbqqxq0Pb8KR6vv4VcjX3K4DK1iejz5YwMAzAT6WVz3ADDiGNXKAJBTWBwC9Yd6wJK9kzRdFOO6hX0BXJJdcAcXNPuq+VYExLvLDUi+TQAcntWI2BfCsf2O3x8AYEWewrPhiYBwjg8BUHi2nE6jHt92cFdceEr+M4BLsguSLO1aD0PIpfUMr23sGfvcHHsyJjS859dD01FBRh18j/K34c5YqyP8CkwZQKgPKrPTY/ZC3AADzm7BHVxAQQag1lyHztaF3RZ6kh1GGPSuUJybtSs21otI6AaCBCLsWnOdpquVtwHoco7T5RwnKCoERYUvs0s0y3uXJ2GAYWeP0L/cD4DFmobFmgaEeqGgooI3+pBfSUYmAM9WPbxccQtTc7NR/wgJf0jKCq+oqfqdMM/WDIKlUrPvOn8C0CH7mZ53H/jDk5SkHB75AzakByR0ilP5AAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete 10 papers',                                            condition: { type: 'activityCount', activityType: 'paper-completed', count: 10 } },
  { id: 'papers-25',       name: 'Voracious Reader',    icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACzUlEQVR4nO2WXUhTYRjHf87SiTP6oIykD8UVaguljbawQrZEA9NEg8pi9HFRdFFBF33cdFFdSOmNVhIUBiqmUFOLdGtlH0zHdDdlaW3RiIIooZUbrTxdDGZjZ2dZQRftDwfO+z7/533+530+OBBHHHH8YyTEIpypLhC2bzbQYjKze8dabl43U15tgK9fsfY4Afgc+B7ht69liMPGzQDUXTVFjSMpIEUuE2IJBPD5J3/2icYRjSUpYLxjqwBw8VxfaG//sSxR7oWzrikRKl2Y7VDTrahxxOWKYNuBvb9KBSB7uTL0SGGGlHHg3svQe2vjZQBsvZC3yC/KX61TU95o4awKXoyO/ZLQqFeTIpcJ7uY9ADj7h8JssqS5kfzkqcssruujLGdZaN018ipqDUS9gXp9Jul582ir7aFokxaSknCabeQbtFiu9EXwl+Rmoq5SBQV0ONEbCklVyAFoH26K+qHSKejsBcB6ywaA3fGWca8Mh+tjGG911lxeP3WjRsVT8ygAypV5UkeHIJkC6/F83K4AdsdbyUO+TAQAqNqjwXF7jFN2D/MVct5/nqqVaafA559McLsCQqWxEstgI7MSBXJUSyJ4SxfOI7diFT2XunE98XDK7mF3SbANZ8sTATh/42FU8ZJzoNWoEiyD70LrNfmLRXkDTg+agmBhPvLMpFi/ltmpKcxPXxD023niz+bAyWNGACYTvogGB7APfySjoAS/d4KRkWeh4LHwV0bxz/D5J0XH8bRrAIKtuH79BuqbOml+42XLIgVblNmiXE2Nnu4GE0edYxypKAyznW7r/702HP/0DWVOMO+7MtLwCgIvJz6gCMgjuN0Npoi9UoOOjQdrpULEroG79x7jFQRqtmpjUcMClxp0sYnEqIFyZbqQ+t1HkTYbq+0FZetW0PXgOasy5qBTa7h2576o36fktLB1+7Ar5n9HHHHE8f/iBw365W4Me0QQAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete 25 papers',                                            condition: { type: 'activityCount', activityType: 'paper-completed', count: 25 } },
  { id: 'papers-50',       name: 'Scholar',             icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADqUlEQVR4nO2WS6hVZRTHf2vt6+BGEeIskSLpZZwr2r0iaXpBolFGIU5qEJRce3An2igssceoMKRBIj0mEgkJ1qRRgzLRKIogrj0HlU689DAo6J5v/Rt8+3nOMe8kGnQXbPbe56zHf631X+vbsCRL8h+LLUJHi7RdrN5l/+w4On3kvvyQ8s9mgSLY+Mi7bXt99NpOPDWmZkEK2DTz9iA0u9SLZnf02HnXdbgcL63chMIbLc8mhTuTDx/n4ONrmZq4EbfA244dLEQIMGPMRCixYdeJCpABHRsmrr+yAzUsCBkygZd3wEykCPbvWMnkxOo6eCgIQBYoILCMV1UJCo4+vakTowNgWWFAgCXCogYBIEVTKuUq9D1n2jflwHIU+Y5UB3aDEMiNFHTEGSHRapqXjybDysBmTjFmPHvsHJsfOo4FhJwoK9TCSqgJDgPRLwWgTZooWVKVH7Kz8dtma72FhXEieakvzKKTRAYShGou1zLWeTMfOUxhgcvr7MenZrm1t5WfL5zn02P7COWWmTneSj8QXvLcwpCLiG7OXQAwcjCrNsiEWyAz3n/9CT556wBmBe7B9MybAJw6cg/mXrehDWKUdOCYGUL1CDYVyK7chCR++fw9imUFKAFQFEWtqwBFYKi+RGAj+j9cgbLhIQOrgHgDVeAhtj7wPB8cfZJ+f4He9DSr1j3Ix2/cS/yVShdp2DUZ2GUrUKVhFiXxIl+lrQhe3buFLfc/x58LfeZ/uIAbTG1by8aZd0pPBaao8+8AGeDYcAsMcM+zPFCcIJEcejddzeE9mzn9xRxnznzIy3u3Y6v2k849xe27TqCApGbspNy6UUM3egzJuxxK4gHe6mEfse6WFYxh9K411q8uODR7N8U1B/jj/D7u2H0CmTIRKwILkoZHrNMotRRMzeqtQlsYILwwgkThIixTbXLNGAcfu5MrVj7DycPbs37Jm3bcQRp0KlABqHhbAQk1Y2RmNaL2tIQZUxNX8dKj03z25UWQyrWcV7dk5YT8QwXqIK3gXawD52pFTAelPMDre8tzmiYUg/Nv2MAq7ALoU1cAIErKzn39a/4jNQ57a1bkoGVbzn4736ABbr5heR208goMHUYdABHi+7nfa+SSSEpU2zNazfzxp99I9Pnqm/l674eMapLPfneRCMNDrb4LK7pV6ZLQvQ5kISICBDOHTg2dES/s3kAK5bEVzLx4kkF5Zc82ojqLEaEYWsqdL6IhD/+uLOZ7dEmW5H8gfwPT6dv1oX5BTAAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete 50 papers',                                            condition: { type: 'activityCount', activityType: 'paper-completed', count: 50 } },
  // Quantity — milestones
  { id: 'milestones-10',   name: 'On a Roll',           icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFl0lEQVR4nO2Xa0xURxTHf9zLS67aoIkfjK51VdaS2MWARgRiMFIVQRCDWHUVY02xPlB5aao2Vhs1vlJFQtoaYqi1FkRX0WCoG2nVWJVUvhAUS8TGtvGFli6Cy+70A70DlwXET/3iP7nJzJlz5/+fM2fOnQtv8T/D502cFU0VAFHp75E58n1pd3o8fNH0J/cKrgDgcbr7PW+/HBVNFTFZEbL/8/5bPfpNXjNdtm/kO/olpE8HRVNF8YblBLnamZ9fzKPaMjk2L2E9AaoCgKP+Ps+qTwIwJDwNgDM5NpL3FgN9R0R5HbntYBEHLlQRZTahuVxy/GrDA9l21pwkwBf81ECab9uxmszstF/lTI6NU2tscuv6HQFFU8XYjCTuFdqJMpsMpI9qyxjo6yYoJFXan1V3CPCIQGIXbJB2TfGjLX4MANd2nOuRy8uokwPcXLeK4NBZXiKWLogEIGXUWACKHj0CwH7sIhEhZul79sQeAvEQf/wYANcPXPDaDi8BIVkpQifXoYv4JCGRwf4BJO47QNNNO8m2XJweF1Ulu9CsaRRuWgvAN2XnOXtij2HelONFBD5uwVF4ycDp213Adv8RLD50BLoI0Fd+9dARIkLMNN20A+D0uAw+GbsPd59O4vqBC5zJseHoZjckoZ4s08ZbSE7JlKuP2B5teCl4UlKvRH9UlwDwaUEBAMPDU0lNzZLb2FdCcj53vVA0VcSGh4rY8FChaKo4vuUjoWiqaH1YJloflglFU8XkiePEi9py8fJeqXwUTRV/1ZWJJ4128aTRLhRNFYqmiuljLCJmwmgRM2G0UDRVnM5LNwgwHsMBflhNZqrq7hjM08ZbSJiTA0DL3Y4Vxi3uzPbQ+I1y5cNCU4hPziYixEzZylRcQa8A47HtCpkDiqaKba4qKiv20fSsFUv0IhIiLNLRrQYwe+4WAH4q30NQSCqaNc0Q9tnz8rCazF3nl8SN1ZUALPluM4qmCv00eCWhn1Nl+ECN5tt2Mg99i+1gEc7ffjT4xEdlAHDnVRDQsc9Wk5nKin0GvyVbdhnIAV4ODuw5AtLg193SCW3MDKYOHdnjWM2DBoaFpvQopC8YcsDP/Q4udyvtLhgUlkTb3x6KVixkTlQGc6IymDp0JNee/s75inwALP4tWPxbAOTRBIiblU18cjbLRkxm2ngLo8LjehUgI+Bxun02tQ0VsfM2A2A1mTleeooZKxZK54uX8ml3dR5DnVTvN9/u6EfP7UxQwCDi3Oq1zHFWyWJkiEDK1yXUPGjwUvkkajinz+2X5F2LkU6cbMul/b+6dPnUQXwTxncUtC4iABKPGIuV19eweMNy2XbWnGT50e/lKoMnJWE1mbl1twGhtEqby90qfXSRnletNNVWUFV3Rx7rH7ameS3OC6fz0oWiqbLAOOvLhaKpIjI9RhaX53Wl4nldqYiMDhOR0WGyrxev2HVJQtFU4awvFy8aK8WLxkqhaKoo3b3Iqwp6RWB+fjFTNsbjEYF4ROeR+aXkGpWrZgOdl46uGBKexofJH1C4aS1VR8tpvm2n3T9Ajlt2TGLBjpNe7/X4OZ6yMR6AyqUfMygsiSiziQBVwVF/n6RlM6Xv4uAO/QVPXwJwufgygKz75eVfARBXspNmpY07W2++/nOsY0penLiR72D6uHcBaHN7uNrwAGdNxyr0KgjQVFsh293vD23LOto3sqt6vvz0JuBGvoOylak46u8DGMi7bo0OFy1etrz0RLb5WLn12ZXeaF5/KT21xoY6AJL3FhsEDApLktFx1N/3isLZz1cDkJB1qG+OvgY9TrfP/Pxi2Z925jCaNQ3Fp1WSA7IdHDqLmWc7i9DcbZ11oDf0+wdCv0hMzAxHHTKA3KZBhvHD6mP+aRf8+mW1FN+fed/oz6gnQTre5G/oLbriX4l9UhXrMV8tAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete 10 project milestones',                                condition: { type: 'activityCount', activityType: 'milestone-completed', count: 10 } },
  { id: 'milestones-50',   name: 'Relentless',          icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABM0lEQVR4nO2WvUoDQRSFv2Qn+4OC5YIWWwixshELJZVgkz6lZSCFVlr4Ar6AEBAsxMrOVCIYbGysBB8hICjYGLZZRbKO1W5ldXbZIOypZop77sedOzMXatX6zzIB1gTYIh7NIskP18+56I4pAiEDDKIhC60lJu9TjjaHqo0GYAKs8S0uLgDbW91qAfZWT/J1BqEeg1GCAOJZzMf0BYCn61vVRu8BgHbYoR12GBzvVw/gNT05aSkAZakUgMuz0/kAmIZbJLwYgN/0cwgnXZQB5Gto3ZTn1zEAnuPLAFIF0p84X3tOC5wvGaChBu6u9a3zneT7u8mV5CUD2IcNS9gD4O3+hpWDR8lL/oyy5KQ+yzs9+S+Y+0MkKZuEklFkk1GUTUXVVWD2+WfvyP0kq4yZsFatWr8HVkXIX7KkwAAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Complete 50 project milestones',                                condition: { type: 'activityCount', activityType: 'milestone-completed', count: 50 } },
  // Quantity — writing
  { id: 'writing-100',     name: 'Wordsmith',           icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABxklEQVR4nO2TPWgUQRiGn9nZ2QXB1DYSJeQsREghFtYWKSSGEFKF/GAEQbC3FkGUs7KTgKUhRSzyUxxCQggaQggxP0TBSvIDSUDUmNvbnf0s7jgDV9wsSRFkH5hmhvned95vPsjJycn5nwjCUEzgSxRbiWIrLnf8MxPXWn79/gOA9hU2cdLHOwvxg6Oy7B8dAyBpwtynFe52dzndPXUCgdbyeXMLAO0ZkkqZl8+fUpqaUqetXReYLvbJdLGvIdMgDGV2bV3mljekHEVSjiLpvNftln2Npgm8e9ZFa/sVvEQIwlAqUVR/WWlhgY72ArFNARge6ufDzCQm8CWuJE4JNDVgVPVBylTrmcAXAGWFJFYsr21y63qBlgsXwfeZf9PLzs4hPU9KLvrZ/kDxcYFrl9u42nqJ9Nhjzwh3bt/k/asevs08ZHv3MEu5bAasgLH/Ur0xOIoxb/ky8QCAOE7rZ2LdDTiPoVeba4PG1GxvjA2cKJTp77kbMKSNm1bzdXykLnxSfPt7tjY4tWDp43xNzDQYAUBXM9/b/YnS2VrQ1MD+j4OqBopHr1eB1aZFXUcQHFpw/8UiGoVFiCuJclmu4jk5OTnngr/sjrymDlSwFgAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: '100 writing progress events (~10,000 words above previous peak)', condition: { type: 'activityCount', activityType: 'writing-progress', count: 100 } },
  // Level — tied to phase transitions (5 levels per tier, max level 60)
  { id: 'level-5',         name: 'Kindled',             icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzUlEQVR4nO3TOwrCQBAG4D/GiMawIuIFQhRvYOUFcgQPY2fjgVJ6gtSCEMFeVMxTSHAs1JCU2SDbzFftg5n9YXcBxhhjLZnCImWHE23UHa6UKSw67WaUJRFlSURtrqEjW2iv3XJ83rsYTYRUCKkAF29Zm0/nNgJvJdOqeQBTWNTTh4A+qK/nT6kf0W1aYBgdoEhRBD76zhYAUAQ+oH33/h2gqgj8NuVyAR7XUDscbwQAzmL8CXKPy72m/RoX/FRffZ6/kIaxdC/GGGNKvQFj1zulhFYuZgAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Reach Level 5 — your first tier complete',                      condition: { type: 'level', level: 5 } },
  { id: 'level-20',        name: 'Hatched',             icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADLklEQVR4nO2WXWgUVxTHfzN3Zna8k2oqEY0K1hgVpI2iqR/vfpForO3LRiutltqKLVKD0Ida1AcNioj4GVvE+AH6oFKCtoh5EHwTofqioDFt3CTEJFCNSZPM7F4fll2ymXV2Ngr6kD8MzJw55/x/3Mu5XBjVqN6xtJEU2Y5UP5X8CoBhmniuy6Ene+jv7cu7X14FtiPV2rK1lA7Mp6z004x/9x/foaXnEfWPTubVM3Sy7Ui1vbyWaXIWBVYBViThyxkJhB7W/Jfyg0hMIkaEdUf72XBtJYYNy3Y+ZdNfFVi6S/mseUwrmstXM79XYQFCad+qA8qSlvrv9/3KkpayHamOfFmvbEeqDWWb1bGq5Psf0UZlSUv9vf+wsh35diAsaanhz+ez16sPxhao89U31KX1jepYVb0v59S3a0IB5NyC6IStfFNSTfu53eiaga4ZmAmbE5VXMHWRteZgZQVN91YSZhUCAVINJjvLATCFzsP6KKcvzONWcwMAXT0xahq30H01ym/Lr3J73w46YysAqJ5ak8sfI+inKXSmT5yLp1wazizmwdnvuHmqEoBdNQPM+Ho1CeXx5/YfuHx0NQAR1Z/Rw5KWGuwbfO1UBI7LogVLVQUbSQgXQzMBKB4/BUNLjuAX285Qt3cORWMXpWuaO/5Fif/T37X3thEEEGoMn3Q9xFMuxeOnAOApHU/p1O1eSKFcDHH/VmvxMQzEc/d+LYDtSFXycgkApR9+gh43fTmF4z6ms+tuEsjT8DwtbZ7SZ8U/jgwAIDLMtPVZqy9nQtGCQINcyrkFzc+bckKk9LT7H18sbviP7LwAwiqbeXP345x1gWOYbvS8ienjZqS/s66CID0pHX0dYdoCASvQ39unXWyvzYAIUsp8uK7F6kYGkE1DIXQj80mprSdzdRLKC+wZaguGQwih8VFhSUa8racVIQyESLaMvWhB2FrgIQQhLiS2I1W0+OeMmBDJMktEfPlCGMRetABwvfP4mwNkg8gG0N7bllETxjw0wFAITbh4rsuA5gIw6PnP27DmeQGkIACqJm1Jx4YCXO88noyFNM8bICVLWlkvGvkYj+q90StoOTBX6KtEOgAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Reach Level 20 — your dragon has emerged from the egg',          condition: { type: 'level', level: 20 } },
  { id: 'level-40',        name: 'Risen',               icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACkUlEQVR4nO2WO0wUURSGv7uPYRg2hI2oAR1egRggkRh2I0YJsIkGDYWFj2hhLEzs6GwssbY0ItYWmlC5hRUqJBaKRtAYo1ELEwoT3EXWcZh9XIthZxeEnSFTYLF/Msk99547/z//PedmoIoqqvCBid5mOdHbLHeNfGlU2x1yVVPk0qgmVU3xLSDglbB8nOypr5i7E2GeBGwW0dNo0DRkMXNIeN3uX8D3WAGAZE89TUMWAH0tkhdHanwdhasAVVPkDV3Zck0bKNDXIlk+udGhzbEvATfbGxnfb6LP26ljH345a/L4CbSBgkMKYBqWMPdB+qIXehcBqqbIa3qaaH/QmTMNS8zMRzaIqE3UOvmqpsifKcWJfQkwDUt0zObIpSWZ68IhyK/mkdkaePbKTlzJOXumYnW061lCDYKrB+vc+N2PwDQs0fDQHm9nqwivoQ0UmIrVcbnfAODNxzCTn1KubVIxoWihaVji5emIjI0GmX+SJ3bMdlYmRkovmnmKZYQIrZmsZCR77lueetRzGwKIVt0hZzj+z3p4bJCVjOTAAzu+E4/6q4G7bSpgOxFdP05xuB2G48iAXYii5Sxgu5FNzgG2Y6qmyFOtWddCDG23oGqKvHTU5EIX1HQIIAtAvq3NJs6UyItQtBy/l3FEgM8ugCI5BIe6HHIAGQH2nref4lxihKge5vO5iHM7vjujVHTBUw2Ukwe6pxGZ4m7VfsogEyPonUHS47XonUHc4ElA+ZcDiPg0ge7pDbGIl+Lw2KAznvwm1o9jhwJMwxKPvtiVF3g+V5pffutFMwCLC3luv16t2I4VHbgymxKRe5LU+z+OCOXHra1FFExnmE3OsbiQ5/FXd5Gul4Xfv55K9ldRxX+BvyB85D/W/r65AAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Reach Level 40 — your dragon is fully grown',                   condition: { type: 'level', level: 40 } },
  { id: 'level-55',        name: 'Luminary',            icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC1ElEQVR4nO2WTUhUURzFf/fNc96MXzOKCSGikIWIJK0sEwrKsIQyKTcRQmG1aFWLkFZGErgKpJA2EtRGkiibPoyK1EVDYIZYi+gLFUTSnGHUGWfeuy3EaaZx3rzRRRvP7t7/feece7j3fx9sYhP/GWK9H97taJARRY2Oz7Y9WheXmnpJcly8MYShG4QW5te9EcWsGAqG5HqJV7Ho85lymBrQHJqQRmRNAk1IvvQe5GvfIVPxTJfLNB1TAwBCURNM3Gk/ICsrNcIKSBHm+0Bzgkkr4mkh1sRI3wnpzM2X+rc2OfHiuHTm5ktPV2O0nir2WKRMYBVrJQGgqjqGbgDg6WqUQf90WjtP6xYIRRVGMCA/DZwmMHoeAIeIMN1fg2IIsqpv0nurKR1K633g5e0jEqCsLJuQobJ9RwkA/h8fAXBVdzA1fA0hMxgcnUQKJ6euvErJn3RBT3uTBGioXgKgpNkLwIfe+qg4QGByBEVo2EQEXaoUNgwDMOOpxTMUASAkBS1XPWtqrTnZ094kL3S+BmCibw8AGXZBbmlVwtrA5AhAnIlVTE3MUtU6TlhKui/Vce76gwS9pAloWW4ZayAWGfa/n42O/Yyrbd3ijhtXtY4DJO2Wls7AzPPDsqTZi6EbTPfXxNVWDVSUFwBQenIMAG9XJTtbBlPyW7qGhfXPxJJ/ToQW5kV4WZJTfAZF1VFUHZvNTkV5AYV1PSzbZlnyz4kl/5ywIm7ZQCzy93bj9b5NmB9/cpmi2nfp0qXXBxZ9PqnmrDQZZ26+nH26G1iJ/f29fSiObGEEA1JxZFu+3pYT+Le3P+7cH619vr+LyqMPBYDiyBbpvKKWDJg9LEXFbnTDiJvTHJoILuuWTKQ0YCYeNnQAth17k1B32G2WTJiegflfv5OKL4cN8urND53DbhM+X0S6XGrSM2GagLsgb8PvuZn4hqFluaWS6drwb9smNvFf8QcBfxjkW/FucQAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Reach Level 55 — a distinguished scholar',                      condition: { type: 'level', level: 55 } },
  { id: 'level-60',        name: 'Nova',                icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADkElEQVR4nO2WP48bVRTFf/e+N7Petb3eZRM6aioKeio+AD1CICEq+Di0dPkStEQgISpqhPgAScg6s2N7x55591A4GynaP17iSFDktDPv3PPOu//gHfaAH5rcXHtx7HW4aD+C/y1SSnvZehNue6obHcxmAByObhdSZ9eqXWjdLlTn2/OgrrMAQmH3FrAeBjscJT1/8oyjnNXMm2sBLAKASEb26zQHydW+ONezp08YVW/o6KpdaH25VL/udFBVr5Gsuk6bbqP+stNBzq99q6qs5nx+r6A32nKFg6pS07Y4jjlMjmrWA3ZQJ81fLKgNwhKlBFhBRRhQwjAvjKfHd/LDjjJc973NxkcoAhS0y4EYNjJB9oQwPIwqGZPxBCUDd8wcT+le1u9UeLFcqs6ZZIHbVm/IkInSD1TmoExvBUkQIMTZ6ZSn53OOd7iws484MJ0cIk+IwGVkD8ajQ/y3b7Ffv2Z8fIgk3LYHzMSz+QXuaRf9bgHJoG0apqMaCSLgx0ef0T7+Es9CObH66XNOjscUBSaBOWa8cuxfC8g5qaqyaneFBhxj0XZkEtPJEZ9++AFKItxRyoQ5i5+/4MHJlEGCUjAZcnFQJ9V1vlYpVzCAUV2r22yuvdWqXSgn2PaljKsw/P4dmIMHhOMmQoZHT0mifPQDbts8METB8BIcHU9f4x/lWt2wsQzQbTb2SqGCddl2rXBDHkSAMxAG7oayUNkSlZe3KOaUPuHmuAUxAAkm4/GrwKNRJQ1CEt2wvfCdGbpcLXUym2JhNM0cN+f4wYyLx98QpSPjRAiTY0lMPnlE0yyYPZyiXiBjU8qdMXaWIUDXLhUaMDfCxOx4RvvLVxiOoidFYvj4exQ1OTsPZ1Mu+v5e3Pf6qU5JzWIOZZvZEeBWODl7nzIMNM0clW0+e3IGwWR69HYE5DrpxfOWlLaWOkG8TEALI8xBBcmRQeVBweCGxLsJOwt1/ndDSkICRTB5OGM2ew8hMEOhbb07zE5n9CEo20lZVTeX3r0FZHMlxLYDCbOgXxWTgoggTMi2VTmeHFkZejs7PaVQgKB5PqdKe+yM7flK69VKI67fpOsaXS5X2iyW10b1FVbNQu2ivVPAnQ6oGvjzj7/oGK695XR6StAjE37DQgJwenaCKe4KcTtqu3uU1u66XC7UrVrtGrujUaWc67e+Z/4rVP72F93/Hmnk2neFz/sctoirUfkOb4x/AB2m2FuBpy8jAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Reach the maximum level — peak form, exceptional career',        condition: { type: 'level', level: 60 } },
  // XP
  { id: 'xp-1000',         name: 'Getting Warmed Up',   icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABaklEQVR4nO2WTUrDQBiGn4Sq7UKXiitx5yHcClI8gyAivYCH8CCeQfy5gIouBVFRa2sVqaJNMda0+Vy0jY1N7cykWtC8EJLM3/vMZL4vA4n+u6wYfWUQY6dMzeVqA3lrfLqlawDcn+wwvXSgPJApAPBKtXjYVdoyV15Z28BZ5HYd56Lb3EQmAOA7kcUTC9ugua90AUQKOZzTPACWncKyU8bmJgDg1gNz8eva3eMAiJytBuadd9PZg24UeN+GflRlXyhV6ubsPcEplZod7TD76Fg6eH56LiiHo/oKfJl9+/u3QWpuFdfzAb1coNJIrreyZAhvuMxI9PbR3Q9KAL0qKnuLoXfX85nK7moBqESB1eNifG4m1FDXXBUgSkFC+v1E1KFB5AGzn1Ehx3v+EYDy5Z2JbyyAIB27N2Vm144hxsHGCKBR8Xg5LzK5sh/L3ERSP1qWh815of+R7GcAhmlOy3ho5m2ARIn+lj4AiCmAEi05YhwAAAAASUVORK5CYII=" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Earn 1,000 XP',                                                 condition: { type: 'totalXP', xp: 1000 } },
  { id: 'xp-5000',         name: 'In the Zone',         icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADWElEQVR4nM1XX0hTURj/TYPqoZdNFAQpCILcDCeBD6H5ZzQ0IQLFoayHTMVLPuylJrSFaFY+TMQe4mrB3IP4NMIcRDHBDR8NwlgwpCsEQWaiKYoRp4d1zr57d69Myz+/p+/c+53vfuf3/TsXOG4YuVPFrGYLAwBFlljc28D09F71dYrnH4J+xteKLIn9YcnBFFliAJD0O5mv1ib28Oe64AZWRt2GStQBKu8GqscdMAHA0lATA4D6vihCrcUAgLKRmEnrQOX9CD7+WDFl87FskUMX00+ad1XurT4PIMVQLOBRhSAYCAiqk34nA4DesgLWW1bAACDubVCFU3W4+e4KBgDDdSXCEEePu4X1uFsyKP702K1ygMucTa7D9axmC6Mf3S28hw+akfRkiiwxo2ylGU1PrcgSC0sOxp9ze1QG0gzkAMAZ00+VcV4FFBNdLkbfX666It6NvU4I+cXkrO4ht7ZPqdaW9tB/TeZ/A00I2khoCIKBANNSzWUaDk4/kKKd77GaLYwnO18Df0Mw+/6rcObXl0VdJwf7H6nWn9/MCbnVYReyLS8Xw3UlGSEMtRbj7KVzAFIlOeBp1P3O0UAv6TgWolMZtGUrZ7M/BwA6ygsFbVazRVUuHHFvA4v4asRm2jX7XXZhcMDTqDsbFFkSe2IBD3v+4JbRmY2xHwaOLWbi0XQIpl4OCq9vXy0Vs91Xa2O8z9OS0nZIRZYYD6G29LgeDW1YcjD72kyarWxpo3paB7hM80drl0/JvXzzcBALeET3S/qdgio6z+mcB9QnDUsOMYBWRt2C9uk2G5tus+mGhts6wY3Qm07u1jcAwN2uawCAh+2hDKe/r60K2V56Ade9kwCAxOIqOuUIAOBeON1hFxYSsNkuirW5KD97hg4c2oSil1JKG+3xdIAtDTWxxLsxESq+X0s7HWaq+4AW/a7UcNnY2FY9v3GzQsh0ntf3RTEejAIAfp/OR0d5IQBgZ3UdO6vre6DiqEBDoK11o3o32qP9+TDSUw0jIP3TEPHVpH8aNpdh2lwGkIonlxVZYusn88QBnlUXCYNtzZW6fz1Jv1MMo6WhJjHYjh/205azhWEVTHS5GL/1Rnw14iUto/nuCtUVe/ZpvUpPr/S0nfTt+Ny+nT8w/AFnl0l2Ds5NiQAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Earn 5,000 XP',                                                 condition: { type: 'totalXP', xp: 5000 } },
  { id: 'xp-20000',        name: 'Veteran',             icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABp0lEQVR4nO2UzS4DURTHf6edaakS8R3Sh2BpJ0LErguRiPAAxIIX8ABixcKCrcQCsUR4AUsbiRX10WikEgntTOdY1KBkzLRdWJhfMovJPfd//vecew+EhISEhPwxUkWs5g7StPU0ImJ6Bt1mbuhLHwfWjgRJ/Hq2qHvLA6jzAoDtWKj+/HI3WeLxCJsL/eRPZlUMUT9xX5f503ltHVoD4GF/jPbeNkrfZKPvKtm7Jxyn4FaA7N4c3en1X3P4ViCZBDEETOG1UKKojmes4xQq/ot2yU/e34AxuM7h6hJYKqnp8slKVJpwK2I7Sl/6GH2+5257htTURv0GRGFkYUUwRX/r6Ne2SLKHpNGI/w0IYEBtFdeIClxcPJYT4tEKs9zy5okNcffWZaDCiKUSbzDJXD//WL/NZInYEbBUqOJ5VzMHPojFDb3cHv0UsSxSk0c169XM1e64Xu2OB+i0N0Y9m82oQNR7KgYh8B3woqMz8WcGNBZrcKdgzW2o/tKYouc7kzSJTXurYr1AoqUL7CKJ4S2CPL36DIBiClhaHtFfF2ytVTMk5B/zBqSvnrw5NRicAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Earn 20,000 XP',                                                condition: { type: 'totalXP', xp: 20000 } },
  // Specific academic milestones (match "Milestone: <label>")
  { id: 'submitted',       name: 'Under Review',        icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB3UlEQVR4nO2VTUsbURSGnwwD0oIggiu1xWIQPxAjRCmxjZIIrlzFpQsX/hL/huLCIl0IirhoMcGIEZsPEapWQY1IdKXiQkGjw6SLxGgwc+fORARhXpjF3HvueV7O/TjgyNE7V67w2ZZSCfz6OMb1cezRiC25ZEDlBtPxuZL/L70hW/mlDNxdZiTCwKXm02XOTmhu80kxKtkCoQ7/rUvFqa8JzWk5XKqLxvrP0mvMDJTd/8dSy/pCsA2iTLnM7iKHiT3DgBtFN6X3f/9GdVOfIUtYgcb2YW5PE6YQkYZGxoXzwkOYjs/xoaHHNtwbGOXH5IR9AwC3pwnq3P5CtPb0ScCTK9OmcebXUNE4P4rg8YVAV0vGjVTn9kvBpQxoWR0tq5OMzuINjOYHdeOj4/GFOD+KSMHB4juw8WsK78AYAMnIzAswQDI6ayWlNQPbqc1iaT1fS9/+rY2fAOzs/aWjtfP1DKhVClpWZzu1icfnzZdf0dhaL21GFJ6EjpZuwssRgoN+KQNSvaAIh/zhK5gwuhHBQIDw8ioANR9rKzPw5/faE7y4qswNeG5I0QgO+plfWDJLL96C3f0Dunraubi6MIx5uLk3nHO3fGI/vSM0IOwFwpXWZamDOXLk6M30HyxLkfFZOZ3rAAAAAElFTkSuQmCC" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Submit a manuscript or grant',           condition: { type: 'milestoneLabel', label: 'Submitted' } },
  { id: 'accepted',        name: 'Accepted!',           icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACFElEQVR4nO2VP2gTYRjGn1wuvctd0KFOUqwiLupgpbaEIKjYFP/QokGcHFwcHBQiQoZayChURNRJRdBBRAqCDiKlRAUhRVCpIh6BSBOkxUuamhDtpd7jUO6MYNO72FSQ+40f3/f+nvfl+/gADw+P/4GR/Q/Z7FmhKeHm5oUrxo1NKTuEoZfIRyd5NNxnr1XvD7QupKkP2cUXUgmWc2UaeomJQzkCgPn4SOsnFI/dpCWvvBqmoZdoGgVeiL39TX7i2NmGYVzfAUmRKSnyYlG1Avjn4K9VIWSHAADJex24dDhLAGBmL+8+uOJz61g2gBpSOXpqgmpI5UIqwaKWZkUbp2kUWMn00phdDFDOlXn1zMWGE3CdTlJkioIfqtqON6O30Bnth4A2xLdehxgM2Pu6tuxGX3IdxHwSwfDIkh7RrXxn1z509+wBAHRG+3HnwAbMzF/G+fEYipkpSG0h+LRz+LpxEPgBiJxtWNPVBMKRg7TkAPDi5Rg+TD6HCQMA8D19HMK3eRQ7bmPNpzh8gSDEXdcaOhwHkBSZkcgAtm3vRj6fQ3bqIwBAn57GzJd39r5a1fQVPs+xff1aR7Udv4I/yZfi2dMnTss6m4CkyByMnQYAaNqvbuu7r1XNpp6bq0tYL38/OfZXYotlD1vdW/KVEjtGDanc0RtlQBEYUITV/QUlRbblqyquDzDxOv3v/34PD49W8hM47OU+I6cLfwAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Get a manuscript accepted',              condition: { type: 'milestoneLabel', label: 'Accepted' } },
  { id: 'awarded',         name: 'Funded!',             icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADK0lEQVR4nOWX30tTYRjHP3ObQ0smGhqVzhyL0UTNSSIjJQhNCuZFaYFEdyGBXgRFf0JCFwUSQXTTRdmVXUTWjS2jH5JSkKTUDO0nZIL9ULfXs9PF9Li5zjnvlt3UAwd2nvM9z/ez93nf95wD/3tY0tCqCfeoOhrLGt26AahHqkoBuPFimt72GrZv3pQkeDHxjrMDrwj6SsmxxXUy9WUA1N72GgBC4TkiC4IT+7y8/TyTJNpa4OTGozAAe7xxuJN9o6YeWRIAPJz+DkCj20mODc184tO8pvkwOwdAnbsAgKHxGWRCBsBy/fHrOIQjxp6qAkLhOe1iVMSIihih8FySuWwLbFKYcQhVEW4ad+aRJQQ4YswvLjH2/gcAkQUBwP2JWW6NyZlLixJCb/ZnXDetZXi6dXdKsqd/mKCvlKMBD1cfvKHaW0xP/3C6teUhfnecOVCtNnldiTnpkJ0DAOrRek9KUhExzt1+Tnezh3vjEPSVcmtsWkVyBGQB1I5AGXtLnAy+iy+vgz43VksUgGyHwoW7r7lzqpGW86G0IGSW4bL56s4XrCjRzFfOAQZefgTAVZjL8s5p2g4zALUjUEb9tgItcahyu654f8UW7XeRM5egzxzCtAX+4nyK8jcAYM+yIWJL2LNstF4aTNL1Hqum5XyI7mYPu4pyGZ2aZ0u+w6y8IYDaEShjk3O1iIgtAdB6aZDISHuS2OHvo6vBy66iXC1nt1ppq3Vz81lYdz5IPQsS4/DloRRzgMhIOxcfjKfkCx3GFoZXm3cUA7AYjbIYjeqaJ0IcvzYKQI0rPhJ2qzUjALUzkLrmMw2jyZh2CwCEpG5lFIwiI4B0IP4IILJkvJGJNce6A6yF6Ax4cPj7dLUOfx+Jc2d0ah6hKIb1DTeikcmv1JXnAXYA/OWFdFmtbNSB6Ax4qCvPQxHx/2VmbggghIrdbuHp5HfNHKDSlU9XgzdVryjUljhRBFjtMe0+gAVFv5VGTVbbat0pG8kKiF48mUh+GZ3+Jrg3PqXrZfa4VJu8LgDchdlAfGRk48vPqOn7odR3AUAiiAzEleE3Uh6ZfJrJxl95J/z34hePnx4co8uj4AAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Win a grant',                            condition: { type: 'milestoneLabel', label: 'Awarded' } },
  { id: 'defended',        name: 'Doctor!',             icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABtElEQVR4nO2US0vDQBDH/zubaKF4Ey2KKCoV9K5Hrz4q6BfwI/kh/AqKV18H8eTFg+ADQaTSgxep1Dad8RCbZpNtkwZfh/wgkOzszH92MrNATk7OH6My+sl3xaQ+Av2epOSMp3m119NPRRwBABOlKQh7gaFaq2KhvATXLYA0wR1yrMrM5uFrry94fnzwbZe7oJX9mLY1krAH1+maJkpTaLzX0UDdKgwASpuhRGs45Abfba9h9Qt7KXxVoVqr9hTKBGlopxBeCUoVrUC0gWS+vJhJU7QGKcLtzTXA7c7hYg1q/5nRTdrvVSLCzPR04v77uwewMvtbCq51b68piIkXiyOmuLK7Cgvm5mcTk0ydQIfxsVHr+tHRgTWJmJAkN6EVIgIzxw3CgbhNEABYGOB23/iJCYijQR66JRf238VPan2tAkVmbwmLLx5eazWt8dNcm8bxNja2zGSCSGRUJarxcVqR4dXDrFd/CNIDX9OkXPHOtq32VGNo4M/0YC7SwsnFk9WWegoyQ1rq5zvQBLwdb3YqGDB4BTLgcAvLy5P2/H4jAa8jQzpxLH+GIUdCzZuTk/O/+ATFl5q3F/dq7gAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Defend your thesis',                     condition: { type: 'milestoneLabel', label: 'Defended' } },
  { id: 'talk-delivered',  name: 'On Stage',            icon: `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB50lEQVR4nO2XMWhUQRCGv9ndd57wkJBCEk7UwivE4jDGHFGIQeGqFIIKItoIlqZUQTstU1gG0giCrY0SEu+Ei7E40ULQ0kZBtLdQ39u3FsHLxYAye4kayN+8N7yZf/+dNzPswjb+MSQ6sixhjf01RHHpg8oSbl2/Q8kklHaUGR8ZA+Dh4j3uzsyq+Yw24Ob0bUomwRoLwODuQQDOTF1GUhd+F9u3ALszCbV6rWv7LKP4njMwsAtrHNeu3tCuj9M4X7pwhVZzgcrQXnzhscby7v0HOq+erTqVJWjqQSUAYHKigTNJ1/a+4MhonaLItFR6AfcfzPHp80dE7Lpv1YNVjo7U1N2gzgBACB4AEdt9B3jz+q2aS902krpw8vipFSHfCrxb3UO7Oa/mU2fAeOFQ7TDV/Xs4e/o8radLAKSp0G7Oa+niJqGkLjSOTVIfnaDzYpnECo/ai1HTUD2IYCULAJ2XSywsP0GKDHHrC3PTBABQxIf2IqoLxDkwBcOVClMnGqjnbw+itpHYKN0bJ2AjsTUFZD5fU4SPn7cIX/Kolu4rA+IdmQ9YSf7svBkCfuJAZd/fF5Dloft0Jr4rtmYR9iILYCLHcLSAkOfRC/6K6HtB7wk45D76XhD9C0Lumb54rq/Ft/Ff4AfoqojbZKe9dgAAAABJRU5ErkJggg==" width="16" height="16" style="image-rendering:pixelated;flex-shrink:0"/>`, description: 'Deliver an invited talk',                condition: { type: 'milestoneLabel', label: 'Talk delivered' } },
];

export const TIER_ICONS: string[] = ['🥚','🥚','🥚','🥚','🐣','🐣','🐣','🐣','🐉','🐉','🐉','🐉'];

export const ONBOARDING_XP = {
  phd: 1000,
  masters: 400,
  authoredBook: 1200,
  firstAuthorPaper: 500,
  coAuthorPaper: 150,
  grantPI: 600,
  grantCoI: 200,
  invitedTalk: 200,
  conferenceTalk: 100,
  phdStudentSupervised: 300,
  mastersStudentSupervised: 150,
  peerReview: 80,
};

export const DEFAULT_SETTINGS: XPSettings = {
  sourcesFolder: 'Atlas/Sources',
  ideasFolder: 'Atlas/Ideas',
  projectsFolder: 'Efforts',
  atomTag: 'cards/atom',
  projectTags: {
    manuscript: 'project/manuscript',
    conference: 'project/conference',
    'invited-talk': 'project/invited-talk',
    'peer-review': 'project/peer-review',
    grant: 'project/grant',
    report: 'project/report',
    thesis: 'project/thesis',
    data: 'project/data',
    software: 'project/software',
    teaching: 'project/teaching',
    workshop: 'project/workshop',
    supervision: 'project/supervision',
    service: 'project/service',
    outreach: 'project/outreach',
    'research-program': 'project/research-program',
  },
  xpPaperSkimmed: 20,
  xpPaperCompleted: 50,
  xpAtomicNoteCreated: 30,
  xpAtomicNoteDeveloped: 10,
  xpWritingProgressPer100Words: 10,
  writingProgressWordThreshold: 100,
  atomicDevelopmentWordThreshold: 50,
  atomicDevelopmentCooldownMinutes: 60,
  projectTemplates: Object.fromEntries(
    Object.entries(DEFAULT_MILESTONE_TEMPLATES).map(([k, v]) => [
      k,
      { milestones: v.map(m => ({ ...m })) },
    ])
  ),
  builtinActivities: [
    { name: 'Data analysis session', xp: 40 },
    { name: 'Lab / fieldwork session', xp: 40 },
  ],
  customActivities: [],
  tierNames: ['Dormant','Stirring','Kindling','Breaking','Wisp','Flicker','Blaze','Inferno','Drake','Wyrm','Dragon','Nova'],
  statusBarIcon: '⚗️',
};
