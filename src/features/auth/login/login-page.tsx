import { LoginForm } from "@/features/auth/login/form/login-form";
import Link from "next/link";

export function LoginPage() {
	return (
		<main className="from-background via-background to-muted/20 relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br p-4">
			<div className="absolute inset-0 -z-10">
				<div className="bg-primary/5 absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl" />
				<div className="bg-primary/5 absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />
			</div>

			<div className="w-full max-w-md">
				<div className="border-border/50 bg-background/85 hover:border-border/80 space-y-8 rounded-3xl border p-10 shadow-2xl shadow-black/8 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/12 dark:shadow-black/30">
					<div className="flex flex-col items-center space-y-3 text-center">
						<div className="mb-4 flex items-center gap-3">
							{/* <div className="from-primary/10 to-primary/5 ring-primary/10 flex size-10 items-center justify-center rounded-lg bg-linear-to-br ring-1">
								<Image
									src="/operon/logo.png"
									alt="Operon Logo"
									className="text-primary h-10 w-10"
									width={50}
									height={50}
								/>
							</div> */}
							<span className="text-foreground text-2xl font-bold">Dashboard</span>
						</div>
						<h1 className="text-foreground text-4xl font-bold tracking-tight">Welcome back</h1>
						<p className="text-muted-foreground text-base font-medium">
							Sign in to your account to continue
						</p>
					</div>

					<LoginForm />
				</div>

				<p className="text-muted-foreground mt-8 px-8 text-center text-xs leading-relaxed">
					By clicking continue, you agree to our{" "}
					<Link
						href="#"
						className="hover:text-primary decoration-muted-foreground/30 hover:decoration-primary/50 font-medium underline underline-offset-4 transition-colors"
						target="_blank"
					>
						Terms of Service
					</Link>{" "}
					and{" "}
					<Link
						href="#"
						className="hover:text-primary decoration-muted-foreground/30 hover:decoration-primary/50 font-medium underline underline-offset-4 transition-colors"
						target="_blank"
					>
						Privacy Policy
					</Link>
					.
				</p>
			</div>
		</main>
	);
}
