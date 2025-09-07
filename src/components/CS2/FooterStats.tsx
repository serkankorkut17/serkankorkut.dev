import React from 'react'

interface FooterStatsProps {
  mapsLength: number;
  activeMapsLength: number;
}

const FooterStats = ({ mapsLength, activeMapsLength }: FooterStatsProps) => {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
					<div>
						<div className="text-3xl font-bold text-orange-500">{mapsLength}</div>
						<div className="text-gray-600">Total Maps</div>
					</div>
					<div>
						<div className="text-3xl font-bold text-green-500">
							{activeMapsLength}
						</div>
						<div className="text-gray-600">Active Maps</div>
					</div>
					<div>
						<div className="text-3xl font-bold text-blue-500">∞</div>
						<div className="text-gray-600">Possible Lineups</div>
					</div>
				</div>
			</div>
  )
}

export default FooterStats