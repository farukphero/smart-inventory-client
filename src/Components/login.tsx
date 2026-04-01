'use client'
import InputField from "@/src/Components/InputField";
import { useLoginMutation, useSignupMutation } from "@/src/redux/api/User/userApi";
import { setUser } from "@/src/redux/features/Auth/authSlice";
import { useAppDispatch } from "@/src/redux/hooks";
import { FormValues } from "@/src/types";
import { EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function AuthForm() {
	const [ signup, { isLoading: signUpLoading } ] = useSignupMutation();
	const [ signIn, { isLoading: signInLoading } ] = useLoginMutation();
	const dispatch = useAppDispatch();
	const router = useRouter()

	const [ isSignUp, setIsSignUp ] = useState(false);
	const [ isMobile, setIsMobile ] = useState(false);
	const [ showPassword, setShowPassword ] = useState(false);

	const {
		control: signInControl,
		handleSubmit: signInHandleSubmit,
		watch: signInWatch,
		setValue: signInSetValue,
		clearErrors: signInClearErrors,
		formState: { errors: signInError },
	} = useForm<FormValues>({
		defaultValues: {
			fullName: "sdsdsdsd",
			email: "farukk@gmail.com",
			password: "Omar123456",
		},
	});

	const {
		control: signUpControl,
		handleSubmit: signUpHandleSubmit,
		watch: signUpWatch,
		setValue: signUpSetValue,
		clearErrors: signUpClearErrors,
		formState: { errors: signUpError },
		reset,
	} = useForm<FormValues>({
		defaultValues: {
			fullName: "vbvbvbvb",
			email: "farukk@gmail.com",
			password: "Omar123456",
		},
	});

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);

		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// 🔥 Sign In handler added
	const onSignIn = async (data: FormValues) => {
		try {
			const response = await signIn(data).unwrap();
			router.push("/dashboard");
			if (response.success) {
				toast.success("Welcome back! Login successful 🎉");
				router.push("/dashboard");
				dispatch(setUser({ token: response.data.accessToken }));
				reset();
				setIsSignUp(false);
			}
		} catch (err: any) {
			if (err?.status === "FETCH_ERROR") {
				toast.error("Network error. Please check your connection and try again.");
			} else if (err?.data?.message) {
				toast.error(err.data.message);
			} else if (err?.message) {
				toast.error(err.message);
			} else {
				toast.error("An unknown error occurred. Please try again later.");
			}
		}
	};


	const onSignUp = async (data: FormValues) => {
		try {
			const response = await signup(data).unwrap();

			if (response.success) {
				toast.success("Account created successfully!");
				router.push("/dashboard");
				dispatch(setUser({ token: response.data.accessToken }));
				reset();
				setIsSignUp(false);
			}
		} catch (err: any) {
			if (err?.status === "FETCH_ERROR") {
				toast.error("Network error. Please check your connection and try again.");
			} else if (err?.data?.message) {
				toast.error(err.data.message);
			} else if (err?.message) {
				toast.error(err.message);
			} else {
				toast.error("An unknown error occurred. Please try again later.");
			}

		}
	};

	// Mobile view
	if (isMobile) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 px-4 py-8">
				<div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
					{/* Mobile Tab Navigation */}
					<div className="flex border-b bg-gray-50">
						<button
							onClick={() => setIsSignUp(false)}
							className={`flex-1 py-4 text-center font-semibold transition-all ${!isSignUp
								? 'text-blue-600 border-b-2 border-blue-600 bg-white'
								: 'text-gray-500 hover:text-gray-700'
								}`}
						>
							Sign In
						</button>
						<button
							onClick={() => setIsSignUp(true)}
							className={`flex-1 py-4 text-center font-semibold transition-all ${isSignUp
								? 'text-blue-600 border-b-2 border-blue-600 bg-white'
								: 'text-gray-500 hover:text-gray-700'
								}`}
						>
							Sign Up
						</button>
					</div>

					<div className="p-6">
						{/* SIGN IN FORM */}
						{!isSignUp && (
							<form onSubmit={signInHandleSubmit(onSignIn)} className="space-y-6">
								<div className="text-center mb-6">
									<h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
									<p className="text-gray-500 mt-2">
										Sign in to continue your journey 🚀
									</p>
								</div>

								<div className="space-y-4">
									<InputField
										name="email"
										label="Email"
										placeholder="Email"
										required="Please enter your email"
										control={signInControl}
										watch={signInWatch}
										setValue={signInSetValue}
										errors={signInError}
										clearErrors={signInClearErrors}
									/>
									<div className="relative">
										<InputField
											name="password"
											label="Password"
											type={showPassword ? "text" : "password"}
											placeholder="Password"
											required="Please enter your password"
											control={signInControl}
											watch={signInWatch}
											setValue={signInSetValue}
											errors={signInError}
											clearErrors={signInClearErrors}
										/>
										<span
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-10 cursor-pointer hover:text-primary transition"
										>
											{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</span>
									</div>



									<button
										disabled={signInLoading}
										type="submit"
										className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
									>
										{signInLoading ? "Signing in..." : "Sign In"}
									</button>
								</div>
							</form>
						)}

						{/* SIGN UP FORM */}
						{isSignUp && (
							<form onSubmit={signUpHandleSubmit(onSignUp)} className="space-y-6">
								<div className="text-center mb-6">
									<h2 className="text-3xl font-bold text-gray-900">Create account</h2>
									<p className="text-gray-500 mt-2">
										Start your journey with us ✨
									</p>
								</div>

								<div className="space-y-4">
									<InputField
										name="fullName"
										label="Full Name"
										placeholder="Full Name"
										required="Please enter your full name"
										control={signUpControl}
										watch={signUpWatch}
										setValue={signUpSetValue}
										errors={signUpError}
										clearErrors={signUpClearErrors}
									/>
									<InputField
										name="email"
										label="Email"
										placeholder="Email"
										required="Please enter your email"
										control={signUpControl}
										watch={signUpWatch}
										setValue={signUpSetValue}
										errors={signUpError}
										clearErrors={signUpClearErrors}
									/>
									<div className="relative">
										<InputField
											name="password"
											label="Password"
											type={showPassword ? "text" : "password"}
											placeholder="Password"
											required="Please enter your password"
											control={signUpControl}
											watch={signUpWatch}
											setValue={signUpSetValue}
											errors={signUpError}
											clearErrors={signUpClearErrors}
										/>
										<span
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-10 cursor-pointer hover:text-primary transition"
										>
											{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</span>
									</div>

									<button
										disabled={signUpLoading}
										type="submit"
										className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
									>
										{signUpLoading ? "Creating account..." : "Sign Up"}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
		);
	}

	// Desktop view (original with overlay)
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 px-4">
			<div className="relative w-full max-w-5xl h-[580px] bg-white rounded-3xl shadow-2xl overflow-hidden">

				{/* SIGN IN */}
				<form
					onSubmit={signInHandleSubmit(onSignIn)}  // 🔥 onSubmit added here
					className={`absolute top-0 left-0 w-1/2 h-full p-12 flex flex-col justify-center transition-all duration-700 ease-in-out
          ${isSignUp ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"}`}
				>
					<h2 className="text-4xl font-bold text-gray-900">Welcome back</h2>
					<p className="text-gray-500 mt-2 mb-8">
						Sign in to continue your journeyasasasa 🚀
					</p>

					<div className="space-y-4">
						<InputField
							name="email"
							label="Email"
							placeholder="Email"
							required="Please enter your email"
							control={signInControl}
							watch={signInWatch}
							setValue={signInSetValue}
							errors={signInError}
							clearErrors={signInClearErrors}
						/>
						<div className="relative">
							<InputField
								name="password"
								label="Password"
								type={showPassword ? "text" : "password"}
								placeholder="Password"
								required="Please enter your password"
								control={signInControl}
								watch={signInWatch}
								setValue={signInSetValue}
								errors={signInError}
								clearErrors={signInClearErrors}
							/>
							<span
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-10 cursor-pointer hover:text-primary transition"
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</span>
						</div>



						<button
							disabled={signInLoading}
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 cursor-pointer"
						>
							{signInLoading ? "Signing in..." : "Sign In"}
						</button>

						<p className="text-center text-sm text-gray-600">
							Don't have an account?{" "}
							<span
								onClick={() => setIsSignUp(true)}
								className="text-blue-600 font-semibold cursor-pointer hover:underline"
							>
								Create account
							</span>
						</p>
					</div>
				</form>

				{/* SIGN UP */}
				<form
					onSubmit={signUpHandleSubmit(onSignUp)}
					className={`absolute top-0 right-0 w-1/2 h-full p-12 flex flex-col justify-center transition-all duration-700 ease-in-out
          ${isSignUp ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}`}
				>
					<h2 className="text-4xl font-bold text-gray-900">Create account</h2>
					<p className="text-gray-500 mt-2 mb-8">
						Start your journey with us ✨
					</p>

					<div className="space-y-4">
						<InputField
							name="fullName"
							label="Full Name"
							placeholder="Full Name"
							required="Please enter your full name"
							control={signUpControl}
							watch={signUpWatch}
							setValue={signUpSetValue}
							errors={signUpError}
							clearErrors={signUpClearErrors}
						/>
						<InputField
							name="email"
							label="Email"
							placeholder="Email"
							required="Please enter your email"
							control={signUpControl}
							watch={signUpWatch}
							setValue={signUpSetValue}
							errors={signUpError}
							clearErrors={signUpClearErrors}
						/>
						<div className="relative">
							<InputField
								name="password"
								label="Password"
								type={showPassword ? "text" : "password"}
								placeholder="Password"
								required="Please enter your password"
								control={signUpControl}
								watch={signUpWatch}
								setValue={signUpSetValue}
								errors={signUpError}
								clearErrors={signUpClearErrors}
							/>
							<span
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-10 cursor-pointer hover:text-primary transition"
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</span>
						</div>

						<button
							disabled={signUpLoading}
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 cursor-pointer"
						>
							{signUpLoading ? "Creating account..." : "Sign Up"}
						</button>

						<p className="text-center text-sm text-gray-600">
							Already have an account?{" "}
							<span
								onClick={() => setIsSignUp(false)}
								className="text-blue-600 font-semibold cursor-pointer hover:underline"
							>
								Sign in
							</span>
						</p>
					</div>
				</form>

				{/* OVERLAY */}
				<div
					className={`absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-center px-10 transition-all duration-700
          ${isSignUp ? "-translate-x-full" : "translate-x-0"}`}
				>
					<div className="max-w-md">
						<h2 className="text-4xl font-bold mb-4">
							{isSignUp ? "Welcome Back!" : "Hello, Friend!"}
						</h2>

						<p className="text-blue-100 mb-8 leading-relaxed">
							{isSignUp
								? "Sign in to access your dashboard, manage your account and continue where you left off."
								: "Join our platform and unlock powerful tools designed to boost your productivity."}
						</p>

						<button
							onClick={() => setIsSignUp(!isSignUp)}
							className="border-2 border-white px-8 py-2 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition cursor-pointer"
						>
							{isSignUp ? "Sign In" : "Sign Up"}
						</button>
					</div>
				</div>

			</div>
		</div>
	);
}
