const SessionCard = ({ session }) => {
  return (
    <>
      <main className="rounded-md shadow-sm/1 border min-h-65 min-w-40 border-neutral-30/50 w-full flex-1">
        <img
          src={session?.image}
          alt="Slide Image"
          className={`w-full h-38 object-cover rounded-t-md ${
            session?.averageAttention > 60
              ? "border-green-600/50"
              : "border-red-600/50"
          } border`}
        />
        <div className="flex flex-col p-2 gap-2">
          <div className="flex flex-col items-start">
            <h3 className="text-sm font-semibold text-black">
              {session?.title}
            </h3>
            <p className="text-xs text-gray-500">{session?.date}</p>
          </div>
          <div className="border-[0.2px]  border-neutral-30/50 w-full"></div>
          <div className="flex gap-1 items-center">
            <div
              className={`size-6 rounded-sm ${
                session?.averageAttention > 60 ? "bg-green-600" : "bg-red-600"
              }`}
            ></div>
            <div className="flex flex-col text-sm text-black items-start">
              <span className="text-neutral-70">Average attention</span>
              <p
                className={`font-bold ${
                  session?.averageAttention > 60
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {session?.averageAttention}%
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default SessionCard;
